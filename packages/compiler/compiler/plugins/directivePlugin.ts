import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {forEach, filter} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstractSlickyEnginePlugin';
import {ElementProcessingDirective} from '../slickyEnginePlugin';
import {AbstractDirectivePlugin, ProcessingDirective} from './abstractDirectivePlugin';
import * as plugins from './directives';
import {IsDirectiveInstanceOfFunction} from '../compiler';


export class DirectivePlugin extends AbstractSlickyEnginePlugin
{


	private processingDirectives: Array<ProcessingDirective> = [];


	constructor(isDirectiveInstanceOf: IsDirectiveInstanceOfFunction)
	{
		super();

		this.register(new plugins.DirectiveHostElementsPlugin);
		this.register(new plugins.DirectiveHostEventsPlugin);
		this.register(new plugins.DirectiveChildDirectivesPlugin(isDirectiveInstanceOf));
		this.register(new plugins.DirectiveChildrenDirectivesPlugin(isDirectiveInstanceOf));
	}


	public register(plugin: AbstractDirectivePlugin): void
	{
		super.register(plugin);
	}


	public onProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): void
	{
		forEach(this.processingDirectives, (directive: ProcessingDirective) => {
			this.hook('onDirectiveInnerElement', directive, element, arg);
		});
	}


	public onBeforeProcessDirective(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, arg: OnProcessElementArgument): void
	{
		this.hook('onBeforeProcessDirective', element, directive, arg);

		forEach(this.processingDirectives, (processingDirective: ProcessingDirective) => {
			this.hook('onProcessDirectiveInParent', element, directive, processingDirective, arg);
		});

		this.processingDirectives.push({
			id: directive.id,
			element: element,
			directive: directive.directive,
			processedHostElements: [],
			processedHostEvents: [],
			processedChildDirectives: [],
		});
	}


	public onAfterProcessElement(element: _.ASTHTMLNodeElement): void
	{
		this.processingDirectives = filter(this.processingDirectives, (directive: ProcessingDirective) => {
			if (directive.element === element) {
				this.hook('onAfterElementDirective', directive);

				return false;
			}

			return true;
		});
	}

}
