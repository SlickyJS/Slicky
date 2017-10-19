import {DirectiveDefinitionDirective} from '@slicky/core/metadata';
import {BuilderFunction} from '@slicky/templates-compiler/builder';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {forEach, filter} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstracSlickyEnginePlugin';
import {AbstractDirectivePlugin, ProcessingDirective} from './abstractDirectivePlugin';
import * as plugins from './directives';


export class DirectivePlugin extends AbstractSlickyEnginePlugin
{


	private processingDirectives: Array<ProcessingDirective> = [];


	constructor()
	{
		super();

		this.register(new plugins.DirectiveHostElementsPlugin);
		this.register(new plugins.DirectiveHostEventsPlugin);
		this.register(new plugins.DirectiveChildDirectivesPlugin);
		this.register(new plugins.DirectiveChildrenDirectivesPlugin);
	}


	public register(plugin: AbstractDirectivePlugin): void
	{
		super.register(plugin);
	}


	public onSlickyBeforeProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): void
	{
		forEach(this.processingDirectives, (directive: ProcessingDirective) => {
			this.hook('onSlickyCheckDirectiveWithElement', directive, element, arg);
		});
	}


	public onSlickyProcessDirective(element: _.ASTHTMLNodeElement, directive: DirectiveDefinitionDirective, directiveId: number, directiveSetup: BuilderFunction, arg: OnProcessElementArgument): void
	{
		this.processingDirectives.push({
			id: directiveId,
			element: element,
			directive: directive,
			processedHostElements: [],
			processedHostEvents: [],
			processedChildDirectives: [],
		});

		forEach(this.processingDirectives, (processingDirective: ProcessingDirective) => {
			this.hook('onSlickyAfterProcessDirective', directive, directiveSetup, processingDirective, arg);
		});
	}


	public onSlickyAfterProcessElement(element: _.ASTHTMLNodeElement): void
	{
		this.processingDirectives = filter(this.processingDirectives, (directive: ProcessingDirective) => {
			if (directive.element === element) {
				this.hook('onSlickyFinishDirective', directive);

				return false;
			}

			return true;
		});
	}

}
