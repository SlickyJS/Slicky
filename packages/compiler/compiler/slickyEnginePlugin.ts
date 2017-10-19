import {EnginePlugin} from '@slicky/templates-compiler';
import {OnProcessElementArgument, OnBeforeCompileArgument, OnExpressionVariableHookArgument, OnAfterProcessElementArgument} from '@slicky/templates-compiler';
import {forEach, filter, clone, merge, unique} from '@slicky/utils';
import * as c from '@slicky/core/metadata';
import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import {createFunction} from '@slicky/templates-compiler/builder';
import {AbstractSlickyEnginePlugin} from './abstracSlickyEnginePlugin';
import * as plugins from './plugins';


declare interface ElementInnerDirectives
{
	element: _.ASTHTMLNodeElement;
	directives: Array<c.DirectiveDefinitionDirective>;
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
		this.hook('onSlickyAfterCompile');
	}


	public onProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): _.ASTHTMLNodeElement
	{
		this.hook('onSlickyBeforeProcessElement', element, arg);

		const directives = this.getDirectives();
		const elementInnerDirectives = {
			element: element,
			directives: [],
		};

		this.elementsInnerDirectives.push(elementInnerDirectives);

		forEach(directives, (directive: c.DirectiveDefinitionDirective) => {
			if (!arg.matcher.matches(element, directive.metadata.selector)) {
				return;
			}

			if (directive.metadata.type === c.DirectiveDefinitionType.Directive) {
				elementInnerDirectives.directives = unique(merge(elementInnerDirectives.directives, directive.metadata.directives));
			}

			const directiveId = this.processedDirectivesCount++;
			const directiveSetup = createFunction(null, ['directive']);

			this.hook('onSlickyProcessDirective', element, directive, directiveId, directiveSetup, arg);

			let factoryMethod: string;

			if (directive.metadata.type === c.DirectiveDefinitionType.Component) {
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
		this.elementsInnerDirectives = filter(this.elementsInnerDirectives, (elementInnerDirectives: ElementInnerDirectives) => {
			return elementInnerDirectives.element !== element;
		});

		this.hook('onSlickyAfterProcessElement', element, arg);
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


	private getDirectives(): Array<c.DirectiveDefinitionDirectivesList>
	{
		let directives = clone(this.metadata.directives);

		forEach(this.elementsInnerDirectives, (elementInnerDirectives: ElementInnerDirectives) => {
			directives = merge(directives, elementInnerDirectives.directives);
		});

		return unique(directives);
	}

}
