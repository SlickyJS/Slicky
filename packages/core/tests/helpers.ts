import {exists} from '@slicky/utils';
import {DirectiveDefinition, createDirectiveMetadata as _createDirectiveMetadata, createComponentMetadata as _createComponentMetadata} from '../metadata';


export function createDirectiveMetadata(partialMetadata: any = {}): DirectiveDefinition
{
	partialMetadata.id = exists(partialMetadata.id) ? partialMetadata.id : 'TestDirective';
	partialMetadata.className = exists(partialMetadata.className) ? partialMetadata.className : 'TestDirective';
	partialMetadata.selector = exists(partialMetadata.selector) ? partialMetadata.selector : 'test-directive';

	return _createDirectiveMetadata(partialMetadata);
}


export function createComponentMetadata(partialMetadata: any = {}): DirectiveDefinition
{
	partialMetadata.id = exists(partialMetadata.id) ? partialMetadata.id : 'TestComponent';
	partialMetadata.className = exists(partialMetadata.className) ? partialMetadata.className : 'TestComponent';
	partialMetadata.selector = exists(partialMetadata.selector) ? partialMetadata.selector : 'test-component';
	partialMetadata.template = exists(partialMetadata.template) ? partialMetadata.template : '';

	return _createComponentMetadata(partialMetadata);
}
