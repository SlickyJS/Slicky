import {find, clone, map, camelCaseToHyphens, exists, isFunction} from '@slicky/utils';
import {AppendImportsBuffer, isClassInstanceOf} from '@slicky/typescript-api-utils';
import {TemplateEncapsulation} from '@slicky/core';
import {
	STATIC_FILTERS_STORAGE, STATIC_INNER_DIRECTIVES_STORAGE, STATIC_DIRECTIVE_METADATA_STORAGE,
	DirectiveDefinition, DirectiveDefinitionType, DirectiveDefinitionInput, DirectiveDefinitionOutput,
	DirectiveDefinitionElement, DirectiveDefinitionEvent, DirectiveDefinitionChildDirective,
	DirectiveDefinitionChildrenDirective, DirectiveDefinitionInnerDirective, DirectiveDefinitionFilterMetadata,
} from '@slicky/core/metadata';
import {Compiler} from '@slicky/compiler';
import {FileAnalyzer, FileDefinitionDirective, FileDefinition} from '../analyzers';
import * as ts from 'typescript';
import * as path from 'path';
import {forEach} from "../../utils/utils/objects";


const KNOWN_METADATA_OPTIONS: Array<string> = [
	'type', 'id', 'className', 'selector', 'exportAs', 'onInit', 'onDestroy', 'onTemplateInit', 'onUpdate', 'onAttach',
	'inputs', 'outputs', 'elements', 'events', 'directives', 'override', 'childDirectives', 'childrenDirectives',
	'template', 'filters', 'styles', 'encapsulation',
];


export function createDirectiveTransformer(fileAnalyzer: FileAnalyzer, compilerOptions: ts.CompilerOptions, moduleResolutionHost: ts.ModuleResolutionHost, onDone?: (file: FileDefinition) => void): ts.TransformerFactory<ts.SourceFile>
{
	return function filterTransformer(context: ts.TransformationContext): ts.Transformer<ts.SourceFile>
	{
		return (sourceFile: ts.SourceFile) => {
			const analyzedFile = fileAnalyzer.analyzeFile(sourceFile);
			const importsBuffer = new AppendImportsBuffer;

			function visit(node: ts.Node): ts.Node
			{
				if (ts.isClassDeclaration(node) && (<ts.ClassDeclaration>node).name) {
					const directiveClass = <ts.ClassDeclaration>node;
					const directive: FileDefinitionDirective = find(analyzedFile.directives, (directive: FileDefinitionDirective) => {
						return directive.metadata.className === (<ts.Identifier>directiveClass.name).text;
					});

					if (directive) {
						const members = map(clone(directiveClass.members), (member: ts.ClassElement) => {
							if (member.decorators && member.decorators.length) {
								if (ts.isPropertyDeclaration(member)) {
									const property = <ts.PropertyDeclaration>member;
									return ts.createProperty([], property.modifiers, property.name, property.questionToken, property.type, property.initializer);

								} else if (ts.isMethodDeclaration(member)) {
									const method = <ts.MethodDeclaration>member;
									return ts.createMethod([], method.modifiers, method.asteriskToken, method.name, method.questionToken, method.typeParameters, method.parameters, method.type, method.body);
								}
							}

							return member;
						});

						importsBuffer.add('@slicky/lang', undefined, 'ClassType');
						importsBuffer.add('@slicky/core/metadata', undefined, 'DirectiveDefinition');
						importsBuffer.add('@slicky/core/metadata', undefined, 'DirectiveDefinitionType');

						if (directive.metadata.type === DirectiveDefinitionType.Component) {
							importsBuffer.add('@slicky/core', undefined, 'FilterInterface');
							importsBuffer.add('@slicky/core', undefined, 'TemplateEncapsulation');

							members.push(ts.createProperty(
								[],
								[
									ts.createToken(ts.SyntaxKind.PublicKeyword),
									ts.createToken(ts.SyntaxKind.StaticKeyword),
								],
								STATIC_FILTERS_STORAGE,
								undefined,
								ts.createTypeLiteralNode([
									ts.createIndexSignature(undefined, undefined, [
										ts.createParameter(undefined, undefined, undefined, 'name', undefined, ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)),
									], ts.createTypeReferenceNode('ClassType', [
										ts.createTypeReferenceNode('FilterInterface', []),
									])),
								]),
								createFiltersObject(directive.metadata),
							));
						}

						members.push(ts.createProperty(
							[],
							[
								ts.createToken(ts.SyntaxKind.PublicKeyword),
								ts.createToken(ts.SyntaxKind.StaticKeyword),
							],
							STATIC_INNER_DIRECTIVES_STORAGE,
							undefined,
							ts.createTypeLiteralNode([
								ts.createIndexSignature(undefined, undefined, [
									ts.createParameter(undefined, undefined, undefined, 'id', undefined, ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)),
								], ts.createTypeReferenceNode('ClassType', [
									ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
								])),
							]),
							createDirectivesObject(sourceFile, directive.metadata, importsBuffer),
						));

						members.push(ts.createProperty(
							[],
							[
								ts.createToken(ts.SyntaxKind.PublicKeyword),
								ts.createToken(ts.SyntaxKind.StaticKeyword),
							],
							STATIC_DIRECTIVE_METADATA_STORAGE,
							undefined,
							ts.createTypeReferenceNode('DirectiveDefinition', undefined),
							createDirectiveMetadataObject(directive.metadata, compilerOptions, moduleResolutionHost),
						));

						return ts.createClassDeclaration(
							[],
							directiveClass.modifiers,
							directiveClass.name,
							directiveClass.typeParameters,
							directiveClass.heritageClauses,
							members,
						);
					}
				}

				return ts.visitEachChild(node, visit, context);
			}

			sourceFile = ts.visitNode(sourceFile, visit);
			importsBuffer.applyImports(sourceFile, compilerOptions, moduleResolutionHost);

			if (isFunction(onDone)) {
				onDone(analyzedFile);
			}

			return sourceFile;
		};
	}
}


function createFiltersObject(metadata: DirectiveDefinition): ts.ObjectLiteralExpression
{
	return ts.createObjectLiteral(map(metadata.filters, (filter: DirectiveDefinitionFilterMetadata) => {
		return ts.createPropertyAssignment(
			ts.createLiteral(filter.metadata.name),
			ts.createIdentifier(filter.localName),
		);
	}), true);
}


function createDirectivesObject(sourceFile: ts.SourceFile, metadata: DirectiveDefinition, importsBuffer: AppendImportsBuffer): ts.ObjectLiteralExpression
{
	return ts.createObjectLiteral(map(metadata.directives, (innerDirective: DirectiveDefinitionInnerDirective) => {
		if (sourceFile.fileName !== innerDirective.path) {
			const importPath = path.relative(path.dirname(sourceFile.fileName), innerDirective.path);
			importsBuffer.add('./' + path.basename(importPath, path.extname(importPath)), undefined, innerDirective.localName);
		}

		return ts.createPropertyAssignment(
			ts.createLiteral(innerDirective.metadata.id),
			ts.createIdentifier(innerDirective.localName),
		);
	}), true);
}


function createDirectiveMetadataObject(metadata: DirectiveDefinition, compilerOptions: ts.CompilerOptions, moduleResolutionHost: ts.ModuleResolutionHost): ts.ObjectLiteralExpression
{
	const properties = [
		ts.createPropertyAssignment('type', ts.createPropertyAccess(
			ts.createIdentifier('DirectiveDefinitionType'),
			ts.createIdentifier(DirectiveDefinitionType[metadata.type])),
		),
		ts.createPropertyAssignment('id', ts.createLiteral(metadata.id)),
		ts.createPropertyAssignment('className', ts.createLiteral(metadata.className)),
		ts.createPropertyAssignment('selector', ts.createLiteral(metadata.selector)),
		ts.createPropertyAssignment('exportAs', ts.createArrayLiteral(map(metadata.exportAs, (exportAs: string) => {
			return ts.createLiteral(exportAs);
		}), false)),
		ts.createPropertyAssignment('onInit', metadata.onInit ? ts.createTrue() : ts.createFalse()),
		ts.createPropertyAssignment('onDestroy', metadata.onDestroy ? ts.createTrue() : ts.createFalse()),
		ts.createPropertyAssignment('onTemplateInit', metadata.onTemplateInit ? ts.createTrue() : ts.createFalse()),
		ts.createPropertyAssignment('onUpdate', metadata.onUpdate ? ts.createTrue() : ts.createFalse()),
		ts.createPropertyAssignment('onAttach', metadata.onAttach ? ts.createTrue() : ts.createFalse()),
		ts.createPropertyAssignment('inputs', ts.createArrayLiteral(map(metadata.inputs, (input: DirectiveDefinitionInput) => {
			return ts.createObjectLiteral([
				ts.createPropertyAssignment('property', ts.createLiteral(input.property)),
				ts.createPropertyAssignment('name', ts.createLiteral(camelCaseToHyphens(input.name))),
				ts.createPropertyAssignment('required', input.required ? ts.createTrue() : ts.createFalse()),
			]);
		}), true)),
		ts.createPropertyAssignment('outputs', ts.createArrayLiteral(map(metadata.outputs, (output: DirectiveDefinitionOutput) => {
			return ts.createObjectLiteral([
				ts.createPropertyAssignment('property', ts.createLiteral(output.property)),
				ts.createPropertyAssignment('name', ts.createLiteral(camelCaseToHyphens(output.name))),
			]);
		}), true)),
		ts.createPropertyAssignment('elements', ts.createArrayLiteral(map(metadata.elements, (element: DirectiveDefinitionElement) => {
			return ts.createObjectLiteral([
				ts.createPropertyAssignment('property', ts.createLiteral(element.property)),
				ts.createPropertyAssignment('selector', ts.createLiteral(element.selector)),
				ts.createPropertyAssignment('required', element.required ? ts.createTrue() : ts.createFalse()),
			]);
		}), true)),
		ts.createPropertyAssignment('events', ts.createArrayLiteral(map(metadata.events, (event: DirectiveDefinitionEvent) => {
			const eventProperties = [
				ts.createPropertyAssignment('method', ts.createLiteral(event.method)),
				ts.createPropertyAssignment('event', ts.createLiteral(event.event)),
			];

			if (exists(event.selector)) {
				eventProperties.push(ts.createPropertyAssignment('selector', ts.createLiteral(event.selector)));
			}

			return ts.createObjectLiteral(eventProperties);
		}), true)),
		ts.createPropertyAssignment('directives', ts.createArrayLiteral([])),
		ts.createPropertyAssignment('childDirectives', ts.createArrayLiteral(map(metadata.childDirectives, (childDirective: DirectiveDefinitionChildDirective) => {
			return ts.createObjectLiteral([
				ts.createPropertyAssignment('property', ts.createLiteral(childDirective.property)),
				ts.createPropertyAssignment('required', childDirective.required ? ts.createTrue() : ts.createFalse()),
				ts.createPropertyAssignment('directive', ts.createObjectLiteral([
					ts.createPropertyAssignment('metadata', ts.createPropertyAccess(
						ts.createIdentifier(childDirective.directive.localName),
						ts.createIdentifier(STATIC_DIRECTIVE_METADATA_STORAGE),
					)),
					ts.createPropertyAssignment('directiveType', ts.createIdentifier(childDirective.directive.localName)),
				])),
			]);
		}), true)),
		ts.createPropertyAssignment('childrenDirectives', ts.createArrayLiteral(map(metadata.childrenDirectives, (childrenDirective: DirectiveDefinitionChildrenDirective) => {
			return ts.createObjectLiteral([
				ts.createPropertyAssignment('property', ts.createLiteral(childrenDirective.property)),
				ts.createPropertyAssignment('directive', ts.createObjectLiteral([
					ts.createPropertyAssignment('metadata', ts.createPropertyAccess(
						ts.createIdentifier(childrenDirective.directive.localName),
						ts.createIdentifier(STATIC_DIRECTIVE_METADATA_STORAGE),
					)),
					ts.createPropertyAssignment('directiveType', ts.createIdentifier(childrenDirective.directive.localName)),
				])),
			]);
		}), true)),
	];

	if (metadata.override) {
		properties.push(ts.createPropertyAssignment('override', ts.createObjectLiteral([
			ts.createPropertyAssignment('metadata', ts.createPropertyAccess(
				ts.createIdentifier(metadata.override.localName),
				ts.createIdentifier(STATIC_DIRECTIVE_METADATA_STORAGE),
			)),
			ts.createPropertyAssignment('directiveType', ts.createIdentifier(metadata.override.localName)),
		], false)));
	}

	if (metadata.type === DirectiveDefinitionType.Component) {
		properties.push(ts.createPropertyAssignment('encapsulation', ts.createPropertyAccess(
			ts.createIdentifier('TemplateEncapsulation'),
			ts.createIdentifier(TemplateEncapsulation[metadata.encapsulation])),
		));

		properties.push(ts.createPropertyAssignment('filters', ts.createArrayLiteral()));

		properties.push(ts.createPropertyAssignment('styles', ts.createArrayLiteral(map(metadata.styles, (style: string) => {
			return ts.createLiteral(style);
		}), true)));

		properties.push(ts.createPropertyAssignment('template', compileTemplate(metadata, compilerOptions, moduleResolutionHost)));
	}

	forEach(metadata, (obj: any, key: string) => {
		if (KNOWN_METADATA_OPTIONS.indexOf(key) >= 0) {
			return;
		}

		properties.push(ts.createPropertyAssignment(key, obj));
	});

	return ts.createObjectLiteral(properties, true);
}


function compileTemplate(metadata: DirectiveDefinition, compilerOptions: ts.CompilerOptions, moduleResolutionHost: ts.ModuleResolutionHost): ts.FunctionExpression
{
	const compiler = new Compiler((directive, checkAgainst) => {
		return isClassInstanceOf(directive.node, checkAgainst.node, compilerOptions, moduleResolutionHost);
	});

	const template = compiler.compile(metadata).substr(7);
	const templateSourceFile = <ts.SourceFile>ts.createSourceFile('/template.ts', template, ts.ScriptTarget.Latest);

	const declaration = <ts.FunctionDeclaration>templateSourceFile.statements[0];

	return ts.createFunctionExpression(
		undefined,
		undefined,
		undefined,
		undefined,
		[
			ts.createParameter([], [], undefined, 'template'),
			ts.createParameter([], [], undefined, 'el'),
			ts.createParameter([], [], undefined, 'component'),
			ts.createParameter([], [], undefined, 'directivesProvider'),
		],
		undefined,
		declaration.body,
	);
}
