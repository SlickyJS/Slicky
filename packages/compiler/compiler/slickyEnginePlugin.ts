import {EnginePlugin} from '@slicky/templates-compiler';
import {OnProcessElementArgument, OnBeforeCompileArgument, OnExpressionVariableHookArgument, OnAfterProcessElementArgument} from '@slicky/templates-compiler';
import {forEach, filter, clone, merge, unique, find} from '@slicky/utils';
import * as c from '@slicky/core/metadata';
import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import {createFunction, BuilderFunction} from '@slicky/templates-compiler/builder';
import {Matcher} from '@slicky/query-selector';
import {AbstractSlickyEnginePlugin} from './abstracSlickyEnginePlugin';
import * as plugins from './plugins';


declare interface ElementInnerDirectives
{
	element: _.ASTHTMLNodeElement;
	directives: Array<c.DirectiveDefinitionDirective>;
}


export declare interface ElementProcessingDirective
{
	id: number;
	setup: BuilderFunction;
	directive: c.DirectiveDefinitionDirective;
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
		this.register(new plugins.LifeCycleEventsPlugin);
	}


	public register(plugin: AbstractSlickyEnginePlugin): void
	{
		super.register(plugin);
	}


	public onBeforeCompile(arg: OnBeforeCompileArgument): void
	{
		arg.render.args.push('component');
	}


	public onAfterCompile(): void
	{
		this.hook('onAfterCompile');
	}


	public onProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): _.ASTHTMLNodeElement
	{
		this.hook('onProcessElement', element, arg);

		const directives = this.getDirectives(element, arg.matcher);
		const elementInnerDirectives = {
			element: element,
			directives: [],
		};

		this.elementsInnerDirectives.push(elementInnerDirectives);

		const processingDirectives: Array<ElementProcessingDirective> = [];

		forEach(directives, (directive: c.DirectiveDefinitionDirective) => {
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

				factoryMethod = 'createComponent';
			} else {
				factoryMethod = 'createDirective';
			}

			const factoryArguments = [
				'template',
				'el',
				`"@directive_${processingDirective.id}"`,
				directive.metadata.hash,
			];

			if (!processingDirective.setup.body.isEmpty()) {
				factoryArguments.push(processingDirective.setup.render());
			}

			arg.render.body.add(
				`template.root.${factoryMethod}(${factoryArguments.join(', ')});`
			);
		});

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


	private getDirectives(element: _.ASTHTMLNodeElement, matcher: Matcher): Array<c.DirectiveDefinitionDirective>
	{
		let directives = clone(this.metadata.directives);

		forEach(this.elementsInnerDirectives, (elementInnerDirectives: ElementInnerDirectives) => {
			directives = merge(directives, elementInnerDirectives.directives);
		});

		directives = unique(directives);

		directives = filter(directives, (directive: c.DirectiveDefinitionDirective) => {
			if (!matcher.matches(element, directive.metadata.selector)) {
				return false;
			}

			return true;
		});

		const result: Array<c.DirectiveDefinitionDirective> = [];
		const componentNames: Array<string> = [];
		const directiveNames: Array<string> = [];

		forEach(directives, (directive: c.DirectiveDefinitionDirective) => {
			const dependencyFor: c.DirectiveDefinitionDirective = find(directives, (dependencyFor: c.DirectiveDefinitionDirective) => {
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
					componentNames.push(directive.metadata.name);
				} else {
					directiveNames.push(directive.metadata.name);
				}
			}
		});

		if (componentNames.length > 1) {
			throw new Error(`More than 1 component is attached to element <${element.name}></${element.name}>: ${componentNames.join(', ')}.`);
		}

		if (componentNames.length === 1 && directiveNames.length > 0) {
			throw new Error(`Both component and directive are attached to element <${element.name}></${element.name}>: ${componentNames[0]}, ${directiveNames.join(', ')}.`);
		}

		return result;
	}

}
