import {EnginePlugin} from '@slicky/templates-compiler';
import {OnProcessElementArgument, OnBeforeCompileArgument, OnExpressionVariableHookArgument, OnAfterProcessElementArgument, OnAfterCompileArgument} from '@slicky/templates-compiler';
import {forEach, filter, clone, merge, unique, find} from '@slicky/utils';
import * as c from '@slicky/core/metadata';
import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import {createFunction, BuilderFunction} from '@slicky/templates-compiler/builder';
import {Matcher} from '@slicky/query-selector';
import {AbstractSlickyEnginePlugin} from './abstractSlickyEnginePlugin';
import * as plugins from './plugins';


declare interface ElementInnerDirectives
{
	element: _.ASTHTMLNodeElement;
	directives: Array<c.DirectiveDefinitionInnerDirective>;
}


export declare interface ElementProcessingDirective
{
	id: number;
	setup: BuilderFunction;
	directive: c.DirectiveDefinitionInnerDirective;
}


export class SlickyEnginePlugin extends EnginePlugin
{


	private metadata: c.DirectiveDefinition;

	private processedDirectivesCount: number = 0;

	private elementsInnerDirectives: Array<ElementInnerDirectives> = [];


	constructor(metadata: c.DirectiveDefinition)
	{
		super();

		this.metadata = metadata;

		this.register(new plugins.DirectivePlugin);
		this.register(new plugins.ExportAsPlugin);
		this.register(new plugins.InputsPlugin);
		this.register(new plugins.OutputsPlugin);
		this.register(new plugins.HostElementsPlugin(this.metadata));
		this.register(new plugins.ChildDirectivesPlugin(this.metadata));
		this.register(new plugins.ChildrenDirectivesPlugin(this.metadata));
		this.register(new plugins.LifeCycleEventsPlugin(this.metadata));
	}


	public register(plugin: AbstractSlickyEnginePlugin): void
	{
		super.register(plugin);
	}


	public onBeforeCompile(arg: OnBeforeCompileArgument): void
	{
		arg.render.args.push('component');
		arg.render.args.push('directivesProvider');
		arg.render.body.add('var root = template;');

		this.hook('onBeforeCompile', arg);
	}


	public onAfterCompile(arg: OnAfterCompileArgument): void
	{
		this.hook('onAfterCompile', arg);
	}


	public onProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): _.ASTHTMLNodeElement
	{
		this.hook('onProcessElement', element, arg);

		const directives = this.getDirectives(element, arg.matcher);

		if (!directives.length) {
			return element;
		}

		const directivesStorageSetup = createFunction(null, ['template', 'directivesProvider']);

		const elementInnerDirectives = {
			element: element,
			directives: [],
		};

		this.elementsInnerDirectives.push(elementInnerDirectives);

		const processingDirectives: Array<ElementProcessingDirective> = [];

		forEach(directives, (directive: c.DirectiveDefinitionInnerDirective) => {
			if (directive.metadata.type === c.DirectiveDefinitionType.Directive) {
				elementInnerDirectives.directives = unique(merge(elementInnerDirectives.directives, directive.metadata.directives));
			}

			const processingDirective: ElementProcessingDirective = {
				id: this.processedDirectivesCount++,
				setup: createFunction(null, ['directive']),
				directive: directive,
			};

			processingDirectives.push(processingDirective);

			this.hook('onBeforeProcessDirective', element, processingDirective, arg);

			let factoryMethod: string;

			if (directive.metadata.type === c.DirectiveDefinitionType.Component) {
				processingDirective.setup.args.push('template');
				processingDirective.setup.args.push('outer');

				factoryMethod = 'addComponent';
			} else {
				factoryMethod = 'addDirective';
			}

			const factoryArguments = [
				`"@directive_${processingDirective.id}"`,
				`directivesProvider.getDirectiveTypeByName("${directive.metadata.id}")`,
			];

			if (!processingDirective.setup.body.isEmpty()) {
				factoryArguments.push(processingDirective.setup.render());
			}

			directivesStorageSetup.body.add(
				`template.${factoryMethod}(${factoryArguments.join(', ')});`
			);
		});

		arg.render.body.add(
			`root.createDirectivesStorageTemplate(template, directivesProvider, el, ${directivesStorageSetup.render()});`
		);

		forEach(processingDirectives, (processingDirective: ElementProcessingDirective) => {
			this.hook('onProcessDirective', element, processingDirective, arg);
		});

		forEach(processingDirectives, (processingDirective: ElementProcessingDirective) => {
			this.hook('onAfterProcessDirective', element, processingDirective, arg);
		});

		return element;
	}


	public onAfterProcessElement(element: _.ASTHTMLNodeElement, arg: OnAfterProcessElementArgument): void
	{
		this.elementsInnerDirectives = filter(this.elementsInnerDirectives, (elementInnerDirectives: ElementInnerDirectives) => {
			return elementInnerDirectives.element !== element;
		});

		this.hook('onAfterProcessElement', element, arg);
	}


	public onExpressionVariableHook(identifier: tjs.ASTCallExpression, arg: OnExpressionVariableHookArgument): tjs.ASTExpression
	{
		let parameter: string = (<tjs.ASTStringLiteral>identifier.arguments[0]).value;

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


	private getDirectives(element: _.ASTHTMLNodeElement, matcher: Matcher): Array<c.DirectiveDefinitionInnerDirective>
	{
		let directives = clone(this.metadata.directives);

		forEach(this.elementsInnerDirectives, (elementInnerDirectives: ElementInnerDirectives) => {
			directives = merge(directives, elementInnerDirectives.directives);
		});

		directives = unique(directives);

		directives = filter(directives, (directive: c.DirectiveDefinitionInnerDirective) => {
			if (!matcher.matches(element, directive.metadata.selector)) {
				return false;
			}

			return true;
		});

		const result: Array<c.DirectiveDefinitionInnerDirective> = [];
		const componentNames: Array<string> = [];

		forEach(directives, (directive: c.DirectiveDefinitionInnerDirective) => {
			const dependencyFor: c.DirectiveDefinitionInnerDirective = find(directives, (dependencyFor: c.DirectiveDefinitionInnerDirective) => {
				if (
					dependencyFor.metadata.override &&
					(
						dependencyFor.metadata.override.directiveType === directive.directiveType ||
						directive.directiveType.prototype instanceof dependencyFor.metadata.override.directiveType
					)
				) {
					return true;
				}
			});

			if (!dependencyFor) {
				result.push(directive);

				if (directive.metadata.type === c.DirectiveDefinitionType.Component) {
					componentNames.push(directive.metadata.className);
				}
			}
		});

		if (componentNames.length > 1) {
			throw new Error(`More than 1 component is attached to element <${element.name}></${element.name}>: ${componentNames.join(', ')}.`);
		}

		return result;
	}

}
