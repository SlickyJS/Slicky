import {forEach, find, exists, filter, clone, indent} from '@slicky/utils';
import {
	EnginePlugin, OnProcessElementArgument, OnBeforeCompileArgument, OnAfterProcessElementArgument,
	OnExpressionVariableHookArgument
} from '@slicky/templates-compiler';
import * as c from '@slicky/core/metadata';
import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import {createFunction} from '@slicky/templates-compiler/builder';


declare interface ProcessingDirective
{
	id: number;
	directive: c.DirectiveDefinitionDirective;
	element: _.ASTHTMLNodeElement;
	processedHostElements: Array<c.DirectiveDefinitionElement>;
	processedHostEvents: Array<c.DirectiveDefinitionEvent>;
}


export class SlickyEnginePlugin extends EnginePlugin
{


	private metadata: c.DirectiveDefinition;

	private processedDirectivesCount: number;

	private compileComponents: Array<c.DirectiveDefinition>;

	private processedHostElements: Array<c.DirectiveDefinitionElement>;

	private processedChildDirectives: Array<c.DirectiveDefinitionChildDirective>;

	private processingDirectives: Array<ProcessingDirective>;


	public setComponentMetadata(metadata: c.DirectiveDefinition)
	{
		this.metadata = metadata;
		this.processedDirectivesCount = 0;
		this.compileComponents = [];
		this.processedHostElements = [];
		this.processedChildDirectives = [];
		this.processingDirectives = [];
	}


	public eachCompileComponentRequest(iterator: (componentMetadata: c.DirectiveDefinition) => void): void
	{
		forEach(clone(this.compileComponents), (componentMetadata: c.DirectiveDefinition) => {
			iterator(componentMetadata);
		});
	}


	public onBeforeCompile(arg: OnBeforeCompileArgument): void
	{
		arg.render.args.push('component');

		forEach(this.metadata.precompileDirectives, (directive: c.DirectiveDefinitionDirective) => {
			if (directive.metadata.type === c.DirectiveDefinitionType.Component) {
				this.compileComponents.push(directive.metadata);
			}
		});
	}


	public onAfterCompile(): void
	{
		forEach(this.metadata.elements, (hostElement: c.DirectiveDefinitionElement) => {
			if (this.processedHostElements.indexOf(hostElement) < 0 && hostElement.required) {
				throw new Error(`${this.metadata.name}.${hostElement.property}: required @HostElement was not found.`);
			}
		});

		forEach(this.metadata.childDirectives, (childDirective: c.DirectiveDefinitionChildDirective) => {
			if (this.processedChildDirectives.indexOf(childDirective) < 0 && childDirective.required) {
				throw new Error(`${this.metadata.name}.${childDirective.property}: required @ChildDirective ${childDirective.metadata.name} was not found.`);
			}
		});
	}


	public onProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): _.ASTHTMLNodeElement
	{
		forEach(this.processingDirectives, (directive: ProcessingDirective) => {
			forEach(directive.directive.metadata.elements, (hostElement: c.DirectiveDefinitionElement) => {
				if (directive.processedHostElements.indexOf(hostElement) >= 0) {
					return;
				}

				if (!arg.matcher.matches(element, hostElement.selector, directive.element)) {
					return;
				}

				arg.render.body.add(`template.getParameter("@directive_${directive.id}").${hostElement.property} = el._nativeNode;`);

				directive.processedHostElements.push(hostElement);
			});

			forEach(directive.directive.metadata.events, (hostEvent: c.DirectiveDefinitionEvent) => {
				if (directive.processedHostEvents.indexOf(hostEvent) >= 0) {
					return;
				}

				if (!arg.matcher.matches(element, hostEvent.selector, directive.element)) {
					return;
				}

				arg.render.body.add(
					`el.addEvent("${hostEvent.event}", function($event) {\n` +
					`	template.getParameter("@directive_${directive.id}").${hostEvent.method}($event);\n` +
					`});`
				);

				directive.processedHostEvents.push(hostEvent);
			});
		});

		forEach(this.metadata.elements, (hostElement: c.DirectiveDefinitionElement) => {
			if (!arg.matcher.matches(element, hostElement.selector)) {
				return;
			}

			arg.render.body.add(`component.${hostElement.property} = el._nativeNode;`);

			this.processedHostElements.push(hostElement);
		});

		forEach(this.metadata.directives, (directive: c.DirectiveDefinitionDirective) => {
			if (!arg.matcher.matches(element, directive.metadata.selector)) {
				return;
			}

			const directiveId = this.processedDirectivesCount++;
			const isComponent = directive.metadata.type === c.DirectiveDefinitionType.Component;

			if (isComponent) {
				this.compileComponents.push(directive.metadata);

			} else {
				this.processingDirectives.push({
					id: directiveId,
					element: element,
					directive: directive,
					processedHostElements: [],
					processedHostEvents: [],
				});
			}

			const directiveSetup = createFunction(null, ['directive']);

			forEach(directive.metadata.inputs, (input: c.DirectiveDefinitionInput) => {
				let property: _.ASTHTMLNodeAttribute;
				let isProperty: boolean = false;

				let propertyFinder = (isProp: boolean) => {
					return (prop: _.ASTHTMLNodeAttribute) => {
						if (prop.name === input.name) {
							property = prop;
							isProperty = isProp;

							return true;
						}
					}
				};

				property =
					find(element.properties, propertyFinder(true)) ||
					find(element.attributes, propertyFinder(false))
				;

				if (!exists(property) && input.required) {
					throw new Error(`${directive.metadata.name}.${input.property}: required input is not set in <${element.name}> tag.`);
				}

				if (!exists(property)) {
					return;
				}

				if (isProperty || property instanceof _.ASTHTMLNodeExpressionAttribute) {
					const watchUpdate = [
						`directive.${input.property} = value;`,
					];

					if (directive.metadata.onUpdate) {
						watchUpdate.push(`directive.onUpdate("${property.name}", value);`);
					}

					if (directive.metadata.type === c.DirectiveDefinitionType.Component) {
						watchUpdate.push('template.refresh();');
					}

					directiveSetup.body.add(
						`${isComponent ? 'outer' : 'template'}.watch(function() {\n` +
						`	${arg.engine._compileExpression(property.value, arg.progress, true, true)};\n` +
						`}, function(value) {\n` +
						`${indent(watchUpdate.join('\n'))}\n` +
						`});`
					);

				} else {
					directiveSetup.body.add(`directive.${input.property} = "${property.value}";`);

					if (directive.metadata.onUpdate) {
						directiveSetup.body.add(`directive.onUpdate("${input.property}", "${property.value}");`);
					}
				}

				if (isProperty) {
					element.properties.splice(element.properties.indexOf(property), 1);
				} else {
					element.attributes.splice(element.attributes.indexOf(property), 1);
				}
			});

			forEach(directive.metadata.outputs, (output: c.DirectiveDefinitionOutput) => {
				let event: _.ASTHTMLNodeExpressionAttributeEvent = find(element.events, (event: _.ASTHTMLNodeExpressionAttributeEvent) => {
					return event.name === output.name;
				});

				if (event) {
					element.events.splice(element.events.indexOf(event), 1);
				}

				directiveSetup.body.add(
					`directive.${output.property}.subscribe(function($value) {\n` +
					`	${isComponent ? 'outer' : 'template'}.run(function() {\n` +
					`		${arg.engine._compileExpression(event.value, arg.progress)};\n` +
					`	});\n` +
					`});`
				);
			});

			forEach(this.metadata.childDirectives, (childDirective: c.DirectiveDefinitionChildDirective) => {
				if (childDirective.directiveType === directive.directiveType && !arg.progress.inTemplate) {
					this.processedChildDirectives.push(childDirective);

					directiveSetup.body.add(`component.${childDirective.property} = directive;`);
				}
			});

			forEach(this.metadata.childrenDirectives, (childrenDirectives: c.DirectiveDefinitionChildrenDirective) => {
				if (childrenDirectives.directiveType === directive.directiveType) {
					directiveSetup.body.add(`component.${childrenDirectives.property}.add.emit(directive);`);

					directiveSetup.body.add(
						`template.onDestroy(function() {\n` +
						`	component.${childrenDirectives.property}.remove.emit(directive);\n` +
						`});`
					);
				}
			});

			if (directive.metadata.type === c.DirectiveDefinitionType.Component) {
				if (directive.metadata.onInit) {
					directiveSetup.body.add(
						'template.run(function() {\n' +
						'	directive.onInit();\n' +
						'});'
					);
				}

			} else if (directive.metadata.onInit) {
				directiveSetup.body.add('directive.onInit();');
			}

			if (directive.metadata.onDestroy) {
				directiveSetup.body.add(
					'template.onDestroy(function() {\n' +
					'	directive.onDestroy();\n' +
					'});'
				);
			}

			let factoryMethod: string;

			if (isComponent) {
				directiveSetup.args.push('template');
				directiveSetup.args.push('outer');

				factoryMethod = 'createComponent';
			} else {
				factoryMethod = 'createDirective';
			}

			const factoryArguments = [
				'template',
				'el',
				`"@directive_${directiveId}"`,
				directive.metadata.hash,
			];

			if (!directiveSetup.body.isEmpty()) {
				factoryArguments.push(directiveSetup.render());
			}

			arg.render.body.add(
				`template.root.${factoryMethod}(${factoryArguments.join(', ')});`
			);
		});

		return element;
	}


	public onAfterProcessElement(element: _.ASTHTMLNodeElement, arg: OnAfterProcessElementArgument): void
	{
		this.processingDirectives = filter(this.processingDirectives, (directive: ProcessingDirective) => {
			if (directive.element === element) {
				forEach(directive.directive.metadata.elements, (hostElement: c.DirectiveDefinitionElement) => {
					if (hostElement.required && directive.processedHostElements.indexOf(hostElement) < 0) {
						throw new Error(`${directive.directive.metadata.name}.${hostElement.property}: required @HostElement was not found.`);
					}
				});

				forEach(directive.directive.metadata.events, (hostEvent: c.DirectiveDefinitionEvent) => {
					if (directive.processedHostEvents.indexOf(hostEvent) < 0) {
						throw new Error(`${directive.directive.metadata.name}.${hostEvent.method}: @HostEvent for "${hostEvent.selector}" was not found.`);
					}
				});

				return false;
			}

			return true;
		});
	}


	public onExpressionVariableHook(identifier: tjs.ASTCallExpression, arg: OnExpressionVariableHookArgument): tjs.ASTExpression
	{
		let parameter: string = (<tjs.ASTStringLiteral>identifier.arguments[0]).value;

		if (parameter === '$value') {
			return new tjs.ASTIdentifier(parameter);
		}

		// template.getParameter('variableName')
		if (arg.progress.localVariables.indexOf(parameter) >= 0) {
			return identifier;
		}

		// component.variableName
		return new tjs.ASTMemberExpression(
			new tjs.ASTIdentifier('component'),
			new tjs.ASTIdentifier(parameter)
		);
	}

}
