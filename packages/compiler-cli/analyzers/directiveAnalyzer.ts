import {exists, camelCaseToHyphens, forEach, find, merge, unique, hash} from '@slicky/utils';
import {TemplateEncapsulation} from '@slicky/templates/templates';
import {
	DirectiveDefinitionType, DirectiveDefinitionInput, DirectiveDefinitionOutput, DirectiveDefinitionElement,
	DirectiveDefinitionEvent, DirectiveDefinitionChildDirective, DirectiveDefinitionChildrenDirective, DirectiveDefinition,
	DirectiveDefinitionFilterMetadata,
	createDirectiveMetadata
} from '@slicky/core/metadata';
import {
	resolveRawRequire, resolveIdentifier, resolveIdentifierAsFlatNodesList, lookupSourceFile,
	ResolvedIdentifier, RequiredFile,
} from '@slicky/typescript-api-utils';
import * as ts from 'typescript';
import * as path from 'path';
import {FilterAnalyzer} from './filterAnalyzer';


export declare interface AnalyzedDirective
{
	dependencies: Array<string>,
	definition: DirectiveDefinition,
}


export class DirectiveAnalyzer
{


	private filterAnalyzer: FilterAnalyzer;

	private compilerOptions: ts.CompilerOptions;

	private moduleResolutionHost: ts.ModuleResolutionHost;

	private storage: {[uniqueName: string]: AnalyzedDirective} = {};


	constructor(filterAnalyzer: FilterAnalyzer, compilerOptions: ts.CompilerOptions, moduleResolutionHost: ts.ModuleResolutionHost)
	{
		this.filterAnalyzer = filterAnalyzer;
		this.compilerOptions = compilerOptions;
		this.moduleResolutionHost = moduleResolutionHost;
	}


	public analyzeDirective(directiveClass: ts.ClassDeclaration, need: boolean = true, includeInnerDirectiveNodes: boolean = true): AnalyzedDirective
	{
		const className = (<ts.Identifier>directiveClass.name).text;
		const sourceFile = lookupSourceFile(directiveClass);

		const uniqueName = `${sourceFile.fileName}:${className}`;

		if (exists(this.storage[uniqueName])) {
			return this.storage[uniqueName];
		}

		const directive = this.analyzeDirectiveDecorator(sourceFile, className, directiveClass, includeInnerDirectiveNodes);

		if (!exists(directive)) {
			if (need) {
				throw new Error(`Class ${className} is not a directive or component. Please add @Directive() or @Component() class decorator.`);
			}

			return;
		}

		this.analyzeDirectivePropertiesAndMethods(className, directiveClass, directive, includeInnerDirectiveNodes);

		directive.dependencies = unique(directive.dependencies);

		return this.storage[uniqueName] = directive;
	}


	private analyzeDirectiveDecorator(sourceFile: ts.SourceFile, className: string, directiveClass: ts.ClassDeclaration, includeInnerDirectiveNodes: boolean): AnalyzedDirective
	{
		let directiveDecorator: ts.Decorator = undefined;

		ts.forEachChild(directiveClass, (node: ts.Node) => {
			if (ts.isDecorator(node)) {
				const decorator = <ts.Decorator>node;

				if (ts.isCallExpression(decorator.expression)) {
					const callExpression = <ts.CallExpression>decorator.expression;

					if (ts.isIdentifier(callExpression.expression)) {
						const identifier = <ts.Identifier>callExpression.expression;

						if (identifier.text === 'Directive' || identifier.text === 'Component') {
							directiveDecorator = decorator;
						}
					}
				}

			}
		});

		if (!directiveDecorator) {
			return;
		}

		const callExpression = <ts.CallExpression>directiveDecorator.expression;
		const callName = (<ts.Identifier>callExpression.expression).text;

		if (!callExpression.arguments.length || !ts.isObjectLiteralExpression(callExpression.arguments[0])) {
			throw new Error(`${callName} ${className}: missing metadata configuration object.`);
		}

		let dependencies: Array<string> = [];

		const configuration = <ts.ObjectLiteralExpression>callExpression.arguments[0];
		const definition = createDirectiveMetadata({
			type: callName === 'Directive' ? DirectiveDefinitionType.Directive : DirectiveDefinitionType.Component,
			id: '',
			className: className,
			selector: '',
		});

		ts.forEachChild(configuration, (configurationProperty: ts.PropertyAssignment) => {
			if (ts.isIdentifier(configurationProperty.name)) {
				const property = <ts.Identifier>configurationProperty.name;

				if (property.text === 'selector') {
					if (!ts.isStringLiteral(configurationProperty.initializer)) {
						throw new Error(`${callName} ${className}: selector should be a string.`);
					}

					const selectorName = (<ts.StringLiteral>configurationProperty.initializer).text;

					if (definition.type === DirectiveDefinitionType.Component) {
						if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(selectorName) || selectorName.indexOf('-') < 0) {
							throw new Error(`${callName} ${className}: name should be a lowercased string with at least one dash.`);
						}
					}

					definition.selector = selectorName;

				} else if (property.text === 'id') {
					if (!ts.isStringLiteral(configurationProperty.initializer)) {
						throw new Error(`${callName} ${className}: id should be a string.`);
					}

					definition.id = (<ts.StringLiteral>configurationProperty.initializer).text;

				} else if (property.text === 'template') {
					let templateInitializer = <ts.Node>configurationProperty.initializer;

					if (ts.isIdentifier(templateInitializer)) {
						const resolvedTemplateInitializer = resolveIdentifier<ts.Node>(<ts.Identifier>templateInitializer, this.compilerOptions, this.moduleResolutionHost);

						dependencies = merge(dependencies, resolvedTemplateInitializer.dependencies);
						templateInitializer = resolvedTemplateInitializer.node;
					}

					if (ts.isStringLiteral(templateInitializer)) {
						definition.template = (<ts.StringLiteral>templateInitializer).text;

					} else if (ts.isNoSubstitutionTemplateLiteral(templateInitializer)) {
						definition.template = (<ts.NoSubstitutionTemplateLiteral>templateInitializer).text;

					} else if (ts.isCallExpression(templateInitializer)) {
						const template = this.requireRawFile(callName, className, 'template', sourceFile.fileName, <ts.CallExpression>templateInitializer, 'html');

						dependencies.push(template.path);
						definition.template = template.source;

					} else {
						throw new Error(`${callName} ${className}: template should be a string, template string, arrow function, function expression or simple require call.`);
					}

				} else if (property.text === 'styles') {
					if (!ts.isArrayLiteralExpression(configurationProperty.initializer)) {
						throw new Error(`${callName} ${className}: styles should be an array of string or simple require calls.`);
					}

					definition.styles = [];

					ts.forEachChild(configurationProperty.initializer, (innerNode: ts.Node) => {
						if (ts.isStringLiteral(innerNode)) {
							definition.styles.push((<ts.StringLiteral>innerNode).text);

						} else if (ts.isCallExpression(innerNode)) {
							const styles = this.requireRawFile(callName, className, 'styles', sourceFile.fileName, <ts.CallExpression>innerNode, 'css');

							dependencies.push(styles.path);
							definition.styles.push(styles.source);

						} else {
							throw new Error(`${callName} ${className}: styles should be an array of string or simple require calls.`);
						}
					});

				} else if (property.text === 'encapsulation') {
					if (!ts.isPropertyAccessExpression(configurationProperty.initializer)) {
						throw new Error(`${callName} ${className}: encapsulation should be one of: TemplateEncapsulation.None, TemplateEncapsulation.Emulated or TemplateEncapsulation.Native.`);
					}

					const encapsulationPropertyAccess = <ts.PropertyAccessExpression>configurationProperty.initializer;

					if (!ts.isIdentifier(encapsulationPropertyAccess.expression)) {
						throw new Error(`${callName} ${className}: encapsulation should be one of: TemplateEncapsulation.None, TemplateEncapsulation.Emulated or TemplateEncapsulation.Native.`);
					}

					const encapsulationExpressionIdentifier = <ts.Identifier>encapsulationPropertyAccess.expression;

					if (encapsulationExpressionIdentifier.text !== 'TemplateEncapsulation') {
						throw new Error(`${callName} ${className}: encapsulation should be one of: TemplateEncapsulation.None, TemplateEncapsulation.Emulated or TemplateEncapsulation.Native.`);
					}

					const encapsulationName = (<ts.Identifier>encapsulationPropertyAccess.name).text;

					if (encapsulationName !== 'None' && encapsulationName !== 'Emulated' && encapsulationName !== 'Native') {
						throw new Error(`${callName} ${className}: encapsulation should be one of: TemplateEncapsulation.None, TemplateEncapsulation.Emulated or TemplateEncapsulation.Native.`);
					}

					definition.encapsulation = TemplateEncapsulation[encapsulationName];

				} else if (property.text === 'override') {
					if (!ts.isIdentifier(configurationProperty.initializer)) {
						throw new Error(`${callName} ${className}: override should be an identifier.`);
					}

					const overrideClass = resolveIdentifier<ts.ClassDeclaration>(<ts.Identifier>configurationProperty.initializer, this.compilerOptions, this.moduleResolutionHost);

					if (!overrideClass) {
						throw new Error(`${callName} ${className}: override class ${(<ts.Identifier>configurationProperty.initializer).text} was not found.`);
					}

					if (!ts.isClassDeclaration(overrideClass.node)) {
						throw new Error(`${callName} ${className}: override class should be a ClassDeclaration.`);
					}

					const overrideDirective = this.analyzeDirective(overrideClass.node);

					dependencies = merge(dependencies, overrideClass.dependencies);
					dependencies = merge(dependencies, overrideDirective.dependencies);
					definition.override = {
						localName: (<ts.Identifier>configurationProperty.initializer).text,
						originalName: overrideClass.originalName,
						imported: overrideClass.imported,
						path: overrideClass.sourceFile.fileName,
						metadata: overrideDirective.definition,
						node: includeInnerDirectiveNodes ? overrideClass.node : undefined,
					};

				} else if (property.text === 'directives') {
					if (!ts.isArrayLiteralExpression(configurationProperty.initializer)) {
						throw new Error(`${callName} ${className}: directives should be an array of identifiers.`);
					}

					ts.forEachChild(configurationProperty.initializer, (innerDirective: ts.Node) => {
						if (!ts.isIdentifier(innerDirective)) {
							throw new Error(`${callName} ${className}: directives should be an array of identifiers.`);
						}

						const innerDirectiveClasses = resolveIdentifierAsFlatNodesList(<ts.Identifier>innerDirective, this.compilerOptions, this.moduleResolutionHost);

						dependencies = merge(dependencies, innerDirectiveClasses.dependencies);

						if (!innerDirectiveClasses.nodes.length) {
							throw new Error(`${callName} ${className}: directive class or class list ${(<ts.Identifier>innerDirective).text} was not found.`);
						}

						forEach(innerDirectiveClasses.nodes, (innerDirectiveClass: ResolvedIdentifier<ts.ClassDeclaration>) => {
							if (!ts.isClassDeclaration(innerDirectiveClass.node)) {
								throw new Error(`${callName} ${className}: directives must contain only a list of ClassDirectives.`);
							}

							if (sourceFile !== innerDirectiveClass.sourceFile) {
								const isExported = find(innerDirectiveClass.node.modifiers || [], (modifier: ts.Modifier) => {
									return modifier.kind === ts.SyntaxKind.ExportKeyword;
								});

								if (!isExported) {
									throw new Error(`${callName} ${className}: can not use inner directive ${innerDirectiveClass.originalName}, class is not exported.`);
								}
							}

							const innerDirectiveClassMetadata = this.analyzeDirective(innerDirectiveClass.node);

							dependencies = merge(dependencies, innerDirectiveClassMetadata.dependencies);
							definition.directives.push({
								localName: innerDirectiveClassMetadata.definition.className,
								originalName: innerDirectiveClass.originalName,
								imported: innerDirectiveClass.imported,
								metadata: innerDirectiveClassMetadata.definition,
								path: innerDirectiveClass.sourceFile.fileName,
								node: includeInnerDirectiveNodes ? innerDirectiveClass.node : undefined,
							});
						});
					});

				} else if (property.text === 'filters') {
					if (!ts.isArrayLiteralExpression(configurationProperty.initializer)) {
						throw new Error(`${callName} ${className}: filters should be an array of identifiers.`);
					}

					definition.filters = [];

					ts.forEachChild(configurationProperty.initializer, (filter: ts.Node) => {
						if (!ts.isIdentifier(filter)) {
							throw new Error(`${callName} ${className}: filters should be an array of identifiers.`);
						}

						const filterClass = resolveIdentifier<ts.ClassDeclaration>(<ts.Identifier>filter, this.compilerOptions, this.moduleResolutionHost);

						if (!filterClass) {
							throw new Error(`${callName} ${className}: filter ${(<ts.Identifier>filter).text} does not exists.`);
						}

						if (!ts.isClassDeclaration(filterClass.node)) {
							throw new Error(`${callName} ${className}: filters must be a list of ClassDeclarations.`);
						}

						dependencies = merge(dependencies, filterClass.dependencies);

						const definitionFilter: DirectiveDefinitionFilterMetadata = {
							localName: (<ts.Identifier>filter).text,
							originalName: filterClass.originalName,
							imported: filterClass.imported,
							path: filterClass.sourceFile.fileName,
							metadata: this.filterAnalyzer.analyzeFilter(filterClass.node),
						};

						definition.filters.push(definitionFilter);
					});

				} else if (property.text === 'exportAs') {
					if (ts.isStringLiteral(configurationProperty.initializer)) {
						definition.exportAs.push((<ts.StringLiteral>configurationProperty.initializer).text);

					} else if (ts.isArrayLiteralExpression(configurationProperty.initializer)) {
						ts.forEachChild(configurationProperty.initializer, (exportAs: ts.Node) => {
							if (!ts.isStringLiteral(exportAs)) {
								throw new Error(`${callName} ${className}: exportAs should be a string or an array of strings.`);
							}

							definition.exportAs.push((<ts.StringLiteral>exportAs).text);
						});

					} else {
						throw new Error(`${callName} ${className}: exportAs should be a string or an array of strings.`);
					}

				} else {
					definition[property.text] = configurationProperty.initializer;
				}
			}
		});

		if (definition.selector === '') {
			throw new Error(`${callName} ${className}: missing selector.`);
		}

		if (definition.type === DirectiveDefinitionType.Component) {
			if (!exists(definition.template)) {
				throw new Error(`Component ${className}: missing template.`);
			}

			if (!exists(definition.encapsulation)) {
				definition.encapsulation = TemplateEncapsulation.Emulated;
			}

			if (!exists(definition.filters)) {
				definition.filters = [];
			}

			if (!exists(definition.styles)) {
				definition.styles = [];
			}
		}

		if (definition.id === '') {
			definition.id = this.createDefaultDirectiveId(className, definition, sourceFile);
		}

		return {
			dependencies: dependencies,
			definition: definition,
		};
	}


	private createDefaultDirectiveId(className: string, metadata: DirectiveDefinition, sourceFile: ts.SourceFile): string
	{
		const parts = [
			className,
			metadata.selector,
			path.basename(sourceFile.fileName),
		];

		return `${className}_${hash(parts.join(''))}`;
	}


	private analyzeDirectivePropertiesAndMethods(className: string, directiveClass: ts.ClassDeclaration, directive: AnalyzedDirective, includeInnerDirectiveNodes: boolean): void
	{
		const definition = directive.definition;

		ts.forEachChild(directiveClass, (node: ts.Node) => {
			if (ts.isPropertyDeclaration(node) || ts.isMethodDeclaration(node)) {
				const property = <ts.PropertyDeclaration|ts.MethodDeclaration>node;

				if (!ts.isIdentifier(property.name)) {
					return;
				}

				const propertyName = <ts.Identifier>property.name;

				if (ts.isMethodDeclaration(node)) {
					let isLifeCycleEvent = false;

					if (propertyName.text === 'onInit') {
						definition.onInit = isLifeCycleEvent = true;
					} else if (propertyName.text === 'onDestroy') {
						definition.onDestroy = isLifeCycleEvent = true;
					} else if (propertyName.text === 'onTemplateInit') {
						definition.onTemplateInit = isLifeCycleEvent = true;
					} else if (propertyName.text === 'onUpdate') {
						definition.onUpdate = isLifeCycleEvent = true;
					} else if (propertyName.text === 'onAttach') {
						definition.onAttach = isLifeCycleEvent = true;
					}

					if (isLifeCycleEvent) {
						return;
					}
				}

				let isRequired: boolean = false;
				let input: DirectiveDefinitionInput = null;
				let output: DirectiveDefinitionOutput = null;
				let hostElement: DirectiveDefinitionElement = null;
				let hostEvent: DirectiveDefinitionEvent = null;
				let childDirective: DirectiveDefinitionChildDirective = null;
				let childrenDirective: DirectiveDefinitionChildrenDirective = null;

				ts.forEachChild(property, (propertyNode: ts.Node) => {
					if (ts.isDecorator(propertyNode) && ts.isCallExpression((<ts.Decorator>propertyNode).expression)) {
						const decoratorExpression = <ts.CallExpression>(<ts.Decorator>propertyNode).expression;

						if (ts.isIdentifier(decoratorExpression.expression)) {
							const decoratorName = <ts.Identifier>decoratorExpression.expression;

							if (decoratorName.text === 'Required') {
								isRequired = true;

							} else if (decoratorName.text === 'Input') {
								let inputValue = camelCaseToHyphens(propertyName.text);

								if (decoratorExpression.arguments.length) {
									if (!ts.isStringLiteral(decoratorExpression.arguments[0])) {
										throw new Error(`${className}.${propertyName.text}: @Input() decorator should have no argument or string.`);
									}

									inputValue = (<ts.StringLiteral>decoratorExpression.arguments[0]).text;
								}

								input = {
									property: propertyName.text,
									name: inputValue,
									required: false,
								};

							} else if (decoratorName.text === 'Output') {
								let outputValue = camelCaseToHyphens(propertyName.text);

								if (decoratorExpression.arguments.length) {
									if (!ts.isStringLiteral(decoratorExpression.arguments[0])) {
										throw new Error(`${className}.${propertyName.text}: @Output() decorator should have no argument or string.`);
									}

									outputValue = (<ts.StringLiteral>decoratorExpression.arguments[0]).text;
								}

								output = {
									property: propertyName.text,
									name: outputValue,
								};

							} else if (decoratorName.text === 'HostElement') {
								if (!decoratorExpression.arguments.length || !ts.isStringLiteral(decoratorExpression.arguments[0])) {
									throw new Error(`${className}.${propertyName.text}: @HostElement() decorator should have string selector argument.`);
								}

								hostElement = {
									property: propertyName.text,
									selector: (<ts.StringLiteral>decoratorExpression.arguments[0]).text,
									required: false,
								};

							} else if (decoratorName.text === 'HostEvent') {
								if (!decoratorExpression.arguments.length || !ts.isStringLiteral(decoratorExpression.arguments[0])) {
									throw new Error(`${className}.${propertyName.text}: @HostEvent() decorator should have string event name argument.`);
								}

								if (decoratorExpression.arguments.length > 1 && !ts.isStringLiteral(decoratorExpression.arguments[1])) {
									throw new Error(`${className}.${propertyName.text}: @HostEvent() decorator should have string event name argument.`);
								}

								hostEvent = {
									method: propertyName.text,
									event: (<ts.StringLiteral>decoratorExpression.arguments[0]).text,
								};

								if (decoratorExpression.arguments.length > 1) {
									hostEvent.selector = (<ts.StringLiteral>decoratorExpression.arguments[1]).text;
								}

							} else if (decoratorName.text === 'ChildDirective') {
								if (!decoratorExpression.arguments.length || !ts.isIdentifier(decoratorExpression.arguments[0])) {
									throw new Error(`${className}.${propertyName.text}: @ChildDirective() decorator should have identifier argument.`);
								}

								const childDirectiveClass = resolveIdentifier<ts.ClassDeclaration>(<ts.Identifier>decoratorExpression.arguments[0], this.compilerOptions, this.moduleResolutionHost);

								if (!childDirectiveClass) {
									throw new Error(`${className}.${propertyName.text}: class ${(<ts.Identifier>decoratorExpression.arguments[0]).text} used in @ChildDirective() decorator was not found.`);
								}

								if (!ts.isClassDeclaration(childDirectiveClass.node)) {
									throw new Error(`${className}.${propertyName.text}: identifier ${(<ts.Identifier>decoratorExpression.arguments[0]).text} used in @ChildDirective() should be a ClassDeclaration.`);
								}

								const childDirectiveDirective = this.analyzeDirective(childDirectiveClass.node);

								directive.dependencies = merge(directive.dependencies, childDirectiveClass.dependencies);
								childDirective = {
									property: propertyName.text,
									directive: {
										localName: (<ts.Identifier>decoratorExpression.arguments[0]).text,
										imported: childDirectiveClass.imported,
										path: childDirectiveClass.sourceFile.fileName,
										originalName: childDirectiveDirective.definition.className,
										metadata: childDirectiveDirective.definition,
										node: includeInnerDirectiveNodes ? childDirectiveClass.node : undefined,
									},
									required: false,
								};

							} else if (decoratorName.text === 'ChildrenDirective') {
								if (!decoratorExpression.arguments.length || !ts.isIdentifier(decoratorExpression.arguments[0])) {
									throw new Error(`${className}.${propertyName.text}: @ChildrenDirective() decorator should have identifier argument.`);
								}

								const childrenDirectiveClass = resolveIdentifier<ts.ClassDeclaration>(<ts.Identifier>decoratorExpression.arguments[0], this.compilerOptions, this.moduleResolutionHost);

								if (!childrenDirectiveClass) {
									throw new Error(`${className}.${propertyName.text}: class ${(<ts.Identifier>decoratorExpression.arguments[0]).text} used in @ChildrenDirective() decorator was not found.`);
								}

								if (!ts.isClassDeclaration(childrenDirectiveClass.node)) {
									throw new Error(`${className}.${propertyName.text}: identifier ${(<ts.Identifier>decoratorExpression.arguments[0]).text} used in @ChildrenDirective() should be a ClassDeclaration.`);
								}

								const childrenDirectiveDirective = this.analyzeDirective(childrenDirectiveClass.node);

								directive.dependencies = merge(directive.dependencies, childrenDirectiveClass.dependencies);
								childrenDirective = {
									property: propertyName.text,
									directive: {
										localName: (<ts.Identifier>decoratorExpression.arguments[0]).text,
										imported: childrenDirectiveClass.imported,
										path: childrenDirectiveClass.sourceFile.fileName,
										originalName: childrenDirectiveClass.originalName,
										metadata: childrenDirectiveDirective.definition,
										node: includeInnerDirectiveNodes ? childrenDirectiveClass.node : undefined,
									},
								};
							}
						}
					}
				});

				if (input !== null) {
					input.required = isRequired;
					definition.inputs.push(input);

				} else if (output !== null) {
					definition.outputs.push(output);

				} else if (hostElement !== null) {
					hostElement.required = isRequired;
					definition.elements.push(hostElement);

				} else if (hostEvent !== null) {
					definition.events.push(hostEvent);

				} else if (childDirective !== null) {
					childDirective.required = isRequired;
					definition.childDirectives.push(childDirective);

				} else if (childrenDirective !== null) {
					definition.childrenDirectives.push(childrenDirective);
				}
			}
		});

		forEach(definition.events, (hostEvent: DirectiveDefinitionEvent) => {
			if (exists(hostEvent.selector) && hostEvent.selector.charAt(0) === '@') {
				const hostElementName = hostEvent.selector.substr(1);

				const hostElement: DirectiveDefinitionElement = find(definition.elements, (findHostElement: DirectiveDefinitionElement) => {
					return hostElementName === findHostElement.property;
				});

				if (!hostElement) {
					throw new Error(`${className}.${hostEvent.method}: @HostEvent() requires unknown @HostElement() on ${className}.${hostElementName}.`);
				}

				hostEvent.selector = hostElement.selector;
			}
		});
	}


	private requireRawFile(decoratorName: string, className: string, type: string, file: string, requireCall: ts.CallExpression, extension: string): RequiredFile
	{
		if (!ts.isIdentifier(requireCall.expression) || !requireCall.arguments.length || !ts.isStringLiteral(requireCall.arguments[0])) {
			throw new Error(`${decoratorName} ${className}: ${type} should be a simple require call.`);
		}

		const requireCallIdentifier = <ts.Identifier>requireCall.expression;

		if (requireCallIdentifier.text !== 'require') {
			throw new Error(`${decoratorName} ${className}: ${type} should be a simple require call.`);
		}

		const requirePath = (<ts.StringLiteral>requireCall.arguments[0]).text;

		if (path.extname(requirePath) !== `.${extension}`) {
			throw new Error(`${decoratorName} ${className}: required template must have file extension.`);
		}

		const module = resolveRawRequire(file, requirePath, this.moduleResolutionHost);

		if (!exists(module)) {
			throw new Error(`${file}: can not require file "${requirePath}". File does not exists.`);
		}

		return module;
	}

}
