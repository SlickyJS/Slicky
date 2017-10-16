import {DirectiveDefinitionDirective, DirectiveDefinitionElement, DirectiveDefinitionEvent, DirectiveDefinitionChildDirective} from '@slicky/core/metadata';
import * as _ from '@slicky/html-parser';


export declare interface ProcessingDirective
{
	id: number;
	directive: DirectiveDefinitionDirective;
	element: _.ASTHTMLNodeElement;
	processedHostElements: Array<DirectiveDefinitionElement>;
	processedHostEvents: Array<DirectiveDefinitionEvent>;
	processedChildDirectives: Array<DirectiveDefinitionChildDirective>;
}
