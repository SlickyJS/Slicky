import {ClassType} from '@slicky/lang';
import {stringify, isFunction, forEach, exists, camelCaseToHyphens, flatten, map, unique, merge, find} from '@slicky/utils';
import {findAnnotation, getPropertiesMetadata} from '@slicky/reflection';
import {RenderableTemplateFactory, TemplateEncapsulation} from '@slicky/templates/templates';
import {DirectiveAnnotationDefinition} from './directive';
import {ComponentAnnotationDefinition} from './component';
import {InputDefinition} from './input';
import {OutputDefinition} from './output';
import {RequiredDefinition} from './required';
import {HostElementDefinition} from './hostElement';
import {HostEventDefinition} from './hostEvent';
import {ChildDirectiveDefinition} from './childDirective';
import {ChildrenDirectiveDefinition} from './childrenDirective';
import {FilterInterface} from '../filters';
import {ExtensionsManager} from '../extensions';
import {FilterMetadata, FilterMetadataLoader} from './filterMetadataLoader';


const STATIC_DIRECTIVE_METADATA_STORAGE = '__slicky__directive__metadata__';


export enum DirectiveDefinitionType
{
	Directive,
	Component,
}


export declare interface DirectiveDefinitionInput
{
	property: string,
	name: string,
	required: boolean,
}


export declare interface DirectiveDefinitionOutput
{
	property: string,
	name: string,
}


export declare interface DirectiveDefinitionElement
{
	property: string,
	selector: string,
	required: boolean,
}


export declare interface DirectiveDefinitionEvent
{
	method: string,
	event: string,
	selector?: string,
}


export declare interface DirectiveDefinitionInnerDirective
{
	directiveType: ClassType<any>,
	metadata: DirectiveDefinition,
}


export declare interface DirectiveDefinitionChildDirective
{
	property: string,
	required: boolean,
	directive: DirectiveDefinitionInnerDirective,
}


export declare interface DirectiveDefinitionChildrenDirective
{
	property: string,
	directive: DirectiveDefinitionInnerDirective,
}


export declare interface DirectiveDefinitionFilterMetadata
{
	filterType: ClassType<FilterInterface>,
	metadata: FilterMetadata,
}


export declare interface DirectiveDefinition
{
	type: DirectiveDefinitionType,
	id: string,
	className: string,
	selector: string,
	exportAs?: Array<string>,
	onInit: boolean,
	onDestroy: boolean,
	onTemplateInit: boolean,
	onUpdate: boolean,
	onAttach: boolean,
	inputs: Array<DirectiveDefinitionInput>,
	outputs: Array<DirectiveDefinitionOutput>,
	elements: Array<DirectiveDefinitionElement>,
	events: Array<DirectiveDefinitionEvent>,
	directives: Array<DirectiveDefinitionInnerDirective>,
	override?: DirectiveDefinitionInnerDirective,
	childDirectives: Array<DirectiveDefinitionChildDirective>,
	childrenDirectives: Array<DirectiveDefinitionChildrenDirective>,
	template?: string|RenderableTemplateFactory,
	filters?: Array<DirectiveDefinitionFilterMetadata>,
	styles?: Array<string>,
	encapsulation?: TemplateEncapsulation,
	[name: string]: any,
}


export class DirectiveMetadataLoader
{


	private extensions: ExtensionsManager;

	private filterMetadataLoader: FilterMetadataLoader;

	private globalFilters: Array<ClassType<FilterInterface>> = [];


	constructor(extensions: ExtensionsManager)
	{
		this.extensions = extensions;
		this.filterMetadataLoader = new FilterMetadataLoader;
	}


	public addGlobalFilters(filters: Array<ClassType<FilterInterface>>): void
	{
		this.globalFilters = unique(merge(this.globalFilters, filters));
	}


	public loadDirective(directiveType: ClassType<any>): DirectiveDefinition
	{
		if (!exists(directiveType[STATIC_DIRECTIVE_METADATA_STORAGE])) {
			directiveType[STATIC_DIRECTIVE_METADATA_STORAGE] = this._loadMetadata(directiveType);
		}

		return directiveType[STATIC_DIRECTIVE_METADATA_STORAGE];
	}


	private _loadMetadata(directiveType: ClassType<any>): DirectiveDefinition
	{
		let annotation: DirectiveAnnotationDefinition;
		let type: DirectiveDefinitionType = DirectiveDefinitionType.Directive;

		if (!(annotation = findAnnotation(directiveType, ComponentAnnotationDefinition))) {
			if (!(annotation = findAnnotation(directiveType, DirectiveAnnotationDefinition))) {
				throw new Error(`Class "${stringify(directiveType)}" is not a directive. Please add @Directive() or @Component() annotation.`);
			}
		} else {
			type = DirectiveDefinitionType.Component;
		}

		const name = stringify(directiveType);

		const metadata: DirectiveDefinition = {
			type: type,
			id: exists(annotation.id) ? annotation.id : name,
			className: name,
			selector: annotation.selector,
			onInit: isFunction(directiveType.prototype.onInit),
			onDestroy: isFunction(directiveType.prototype.onDestroy),
			onTemplateInit: isFunction(directiveType.prototype.onTemplateInit),
			onUpdate: isFunction(directiveType.prototype.onUpdate),
			onAttach: isFunction(directiveType.prototype.onAttach),
			directives: this.loadDirectivesMetadata(annotation),
			inputs: [],
			outputs: [],
			elements: [],
			events: [],
			childDirectives: [],
			childrenDirectives: [],
		};

		this.loadPropertiesMetadata(metadata, directiveType);

		if (annotation.exportAs) {
			metadata.exportAs = annotation.exportAs;
		}

		if (annotation.override) {
			metadata.override = {
				directiveType: annotation.override,
				metadata: this.loadDirective(annotation.override),
			};
		}

		if (annotation instanceof ComponentAnnotationDefinition) {
			metadata.encapsulation = annotation.encapsulation;
			metadata.template = annotation.template;
			metadata.styles = annotation.styles;
			metadata.filters = this.loadFiltersMetadata(annotation);
		}

		this.validate(metadata);

		this.extensions.doUpdateDirectiveMetadata(directiveType, metadata, annotation._options);

		return metadata;
	}


	private loadDirectivesMetadata(annotation: DirectiveAnnotationDefinition): Array<DirectiveDefinitionInnerDirective>
	{
		return map(unique(flatten(annotation.directives)), (directiveType: ClassType<any>): DirectiveDefinitionInnerDirective => {
			return {
				directiveType: directiveType,
				metadata: this.loadDirective(directiveType),
			};
		});
	}


	private loadFiltersMetadata(annotation: ComponentAnnotationDefinition): Array<DirectiveDefinitionFilterMetadata>
	{
		const filters = merge(this.globalFilters, annotation.filters);

		return map(unique(filters), (filterType: ClassType<FilterInterface>): DirectiveDefinitionFilterMetadata => {
			return {
				filterType: filterType,
				metadata: this.filterMetadataLoader.loadFilter(filterType),
			};
		});
	}


	private loadPropertiesMetadata(metadata: DirectiveDefinition, directiveType: ClassType<any>): void
	{
		forEach(getPropertiesMetadata(directiveType), (metadataList: Array<any>, property: string) => {
			let input: DirectiveDefinitionInput;
			let element: DirectiveDefinitionElement;
			let childDirective: DirectiveDefinitionChildDirective;

			let required: boolean = false;

			forEach(metadataList, (propertyMetadata: any) => {
				if (propertyMetadata instanceof InputDefinition) {
					input = {
						property: property,
						name: camelCaseToHyphens(exists(propertyMetadata.name) ? propertyMetadata.name : property),
						required: false,
					};

				} else if (propertyMetadata instanceof RequiredDefinition) {
					required = true;

				} else if (propertyMetadata instanceof OutputDefinition) {
					metadata.outputs.push({
						property: property,
						name: camelCaseToHyphens(exists(propertyMetadata.name) ? propertyMetadata.name : property),
					});

				} else if (propertyMetadata instanceof HostElementDefinition) {
					element = {
						property: property,
						required: false,
						selector: propertyMetadata.selector,
					};

				} else if (propertyMetadata instanceof HostEventDefinition) {
					let event: DirectiveDefinitionEvent = {
						method: property,
						event: propertyMetadata.event,
					};

					if (propertyMetadata.selector) {
						event.selector = propertyMetadata.selector;
					}

					metadata.events.push(event);

				} else if (propertyMetadata instanceof ChildDirectiveDefinition) {
					childDirective = {
						property: property,
						required: false,
						directive: {
							directiveType: propertyMetadata.directiveType,
							metadata: this.loadDirective(propertyMetadata.directiveType),
						},
					};

				} else if (propertyMetadata instanceof ChildrenDirectiveDefinition) {
					metadata.childrenDirectives.push({
						property: property,
						directive: {
							directiveType: propertyMetadata.directiveType,
							metadata: this.loadDirective(propertyMetadata.directiveType),
						},
					});
				}
			});

			if (input) {
				if (required) {
					input.required = true;
				}

				metadata.inputs.push(input);

			} else if (childDirective) {
				if (required) {
					childDirective.required = true;
				}

				metadata.childDirectives.push(childDirective);

			} else if (element) {
				if (required) {
					element.required = true;
				}

				metadata.elements.push(element);
			}
		});
	}


	private validate(metadata: DirectiveDefinition): void
	{
		forEach(metadata.events, (event: DirectiveDefinitionEvent) => {
			if (event.selector && event.selector.charAt(0) === '@') {
				const hostElementName = event.selector.substr(1);
				const hostElement = find(metadata.elements, (element: DirectiveDefinitionElement) => {
					return element.property === hostElementName;
				});

				if (!hostElement) {
					throw new Error(`Directive "${metadata.className}" has @HostEvent on "${event.method}" which points to @HostElement on "${hostElementName}" which does not exists.`);
				}

				event.selector = hostElement.selector;
			}
		});
	}

}
