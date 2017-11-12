import {exists} from '@slicky/utils';
import {TemplateEncapsulation} from '@slicky/templates/templates';
import {DirectiveDefinition, DirectiveDefinitionType} from '../metadata';


export function createDirectiveMetadata(partialMetadata: any): DirectiveDefinition
{
	partialMetadata.type = exists(partialMetadata.type) ? partialMetadata.type : DirectiveDefinitionType.Directive;
	partialMetadata.id = exists(partialMetadata.id) ? partialMetadata.id : 'TestDirective';
	partialMetadata.className = exists(partialMetadata.className) ? partialMetadata.className : 'TestDirective';
	partialMetadata.selector = exists(partialMetadata.selector) ? partialMetadata.selector : 'test-directive';

	return createMetadata(partialMetadata);
}


export function createComponentMetadata(partialMetadata: any): DirectiveDefinition
{
	partialMetadata.type = exists(partialMetadata.type) ? partialMetadata.type : DirectiveDefinitionType.Component;
	partialMetadata.id = exists(partialMetadata.id) ? partialMetadata.id : 'TestComponent';
	partialMetadata.className = exists(partialMetadata.className) ? partialMetadata.className : 'TestComponent';
	partialMetadata.selector = exists(partialMetadata.selector) ? partialMetadata.selector : 'test-component';
	partialMetadata.template = exists(partialMetadata.template) ? partialMetadata.template : '';
	partialMetadata.encapsulation = exists(partialMetadata.encapsulation) ? partialMetadata.encapsulation : TemplateEncapsulation.Emulated;
	partialMetadata.filters = exists(partialMetadata.filters) ? partialMetadata.filters : [];
	partialMetadata.styles = exists(partialMetadata.styles) ? partialMetadata.styles : [];

	return createDirectiveMetadata(partialMetadata);
}


function createMetadata(partialMetadata: any): DirectiveDefinition
{
	const metadata: DirectiveDefinition = {
		type: partialMetadata.type,
		id: partialMetadata.id,
		className: partialMetadata.className,
		selector: partialMetadata.selector,
		onInit: exists(partialMetadata.onInit) ? partialMetadata.onInit : false,
		onDestroy: exists(partialMetadata.onDestroy) ? partialMetadata.onDestroy : false,
		onTemplateInit: exists(partialMetadata.onTemplateInit) ? partialMetadata.onTemplateInit : false,
		onUpdate: exists(partialMetadata.onUpdate) ? partialMetadata.onUpdate : false,
		onAttach: exists(partialMetadata.onAttach) ? partialMetadata.onAttach : false,
		inputs: exists(partialMetadata.inputs) ? partialMetadata.inputs : [],
		outputs: exists(partialMetadata.outputs) ? partialMetadata.outputs : [],
		elements: exists(partialMetadata.elements) ? partialMetadata.elements : [],
		events: exists(partialMetadata.events) ? partialMetadata.events : [],
		directives: exists(partialMetadata.directives) ? partialMetadata.directives : [],
		childDirectives: exists(partialMetadata.childDirectives) ? partialMetadata.childDirectives : [],
		childrenDirectives: exists(partialMetadata.childrenDirectives) ? partialMetadata.childrenDirectives : [],
	};

	if (exists(partialMetadata.exportAs)) {
		metadata.exportAs = partialMetadata.exportAs;
	}

	if (exists(partialMetadata.template)) {
		metadata.template = partialMetadata.template;
	}

	if (exists(partialMetadata.encapsulation)) {
		metadata.encapsulation = partialMetadata.encapsulation;
	}

	if (exists(partialMetadata.filters)) {
		metadata.filters = partialMetadata.filters;
	}

	if (exists(partialMetadata.styles)) {
		metadata.styles = partialMetadata.styles;
	}

	return metadata;
}
