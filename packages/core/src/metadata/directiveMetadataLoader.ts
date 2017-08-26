import {findAnnotation, getPropertiesMetadata} from '@slicky/reflection';
import {exists, forEach, stringify, hash, map, isFunction, merge, unique} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {EventEmitter} from '@slicky/event-emitter';
import {InputDefinition, RequiredInputDefinition} from './input';
import {OutputDefinition} from './output';
import {HostElementDefinition} from './hostElement';
import {HostEventDefinition} from './hostEvent';
import {ParentComponentDefinition} from './parentComponent';
import {ChildDirectiveDefinition} from './childDirective';
import {ChildrenDirectiveDefinition} from './childrenDirective';
import {DirectiveAnnotationDefinition} from './directive';
import {ComponentAnnotationDefinition} from './component';
import {FilterDefinition} from './filter';
import {ChangeDetectionStrategy} from '../changeDetection';
import {FilterInterface} from '../filters';


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


export type DirectiveDefinitionInputsList = Array<DirectiveDefinitionInput>;


export declare interface DirectiveDefinitionOutput
{
	property: string,
	name: string,
}


export type DirectiveDefinitionOutputsList = Array<DirectiveDefinitionOutput>;


export declare interface DirectiveDefinitionElement
{
	property: string,
	selector?: string,
}


export type DirectiveDefinitionElementsList = Array<DirectiveDefinitionElement>;


export declare interface DirectiveDefinitionEvent
{
	method: string,
	event: string,
	hostElement?: string,
	selector?: string,
}


export type DirectiveDefinitionEventsList = Array<DirectiveDefinitionEvent>;


export declare interface DirectiveDefinitionParentComponent
{
	property: string,
}


export type DirectiveDefinitionParentComponentsList = Array<DirectiveDefinitionParentComponent>;


export declare interface DirectiveDefinitionChildDirective
{
	property: string,
	directiveType: ClassType<any>,
}


export type DirectiveDefinitionChildDirectivesList = Array<DirectiveDefinitionChildDirective>;


export declare interface DirectiveDefinitionChildrenDirective
{
	property: string,
	directiveType: ClassType<any>,
}


export type DirectiveDefinitionChildrenDirectivesList = Array<DirectiveDefinitionChildrenDirective>;


export declare interface DirectiveDefinitionDirective
{
	directiveType: ClassType<any>,
	metadata: DirectiveDefinition,
}


export type DirectiveDefinitionDirectivesList = Array<DirectiveDefinitionDirective>;


export declare interface DirectiveDefinitionFilter
{
	filterType: ClassType<FilterInterface>,
	metadata: {
		name: string,
		hash: number,
	},
}


export type DirectiveDefinitionFiltersList = Array<DirectiveDefinitionFilter>;


export declare interface DirectiveDefinition {
	type: DirectiveDefinitionType,
	name: string,
	uniqueName: string,
	hash: number,
	selector: string,
	controllerAs?: string,
	exportAs?: string,
	onInit: boolean,
	onDestroy: boolean,
	onUpdate: boolean,
	onCheckUpdates: boolean,
	inputs: DirectiveDefinitionInputsList,
	outputs: DirectiveDefinitionOutputsList,
	elements: DirectiveDefinitionElementsList,
	events: DirectiveDefinitionEventsList,
	parentComponents: DirectiveDefinitionParentComponentsList,
	childDirectives?: DirectiveDefinitionChildDirectivesList,
	childrenDirectives?: DirectiveDefinitionChildrenDirectivesList,
	template?: string,
	changeDetection?: ChangeDetectionStrategy,
	directives?: DirectiveDefinitionDirectivesList,
	filters?: DirectiveDefinitionFiltersList,
	[name: string]: any,
}


export class DirectiveMetadataLoader
{


	public loaded = new EventEmitter<DirectiveDefinitionDirective>();

	private definitions: {[uniqueName: string]: DirectiveDefinition} = {};

	private filters: Array<ClassType<FilterInterface>> = [];


	public addGlobalFilters(filters: Array<ClassType<FilterInterface>>): void
	{
		this.filters = merge(this.filters, filters);
	}


	public load(directiveType: ClassType<any>): DirectiveDefinition
	{
		let annotation: DirectiveAnnotationDefinition;

		if (!(annotation = findAnnotation(directiveType, ComponentAnnotationDefinition))) {
			if (!(annotation = findAnnotation(directiveType, DirectiveAnnotationDefinition))) {
				throw new Error(`Class "${stringify(directiveType)}" is not a directive. Please add @Directive() or @Component() annotation.`);
			}
		}

		let name = stringify(directiveType);
		let directiveHash = this.getDirectiveHash(name, annotation);
		let uniqueName = name + '_' + directiveHash;

		if (exists(this.definitions[uniqueName])) {
			return this.definitions[uniqueName];
		}

		let inputs: DirectiveDefinitionInputsList = [];
		let outputs: DirectiveDefinitionOutputsList = [];
		let elements: DirectiveDefinitionElementsList = [];
		let events: DirectiveDefinitionEventsList = [];
		let parentComponents: DirectiveDefinitionParentComponentsList = [];
		let childDirectives: DirectiveDefinitionChildDirectivesList = [];
		let childrenDirectives: DirectiveDefinitionChildrenDirectivesList = [];

		forEach(getPropertiesMetadata(directiveType), (metadataList: Array<any>, property: string) => {
			let input: DirectiveDefinitionInput;
			let inputRequired: boolean = false;

			forEach(metadataList, (metadata: any) => {
				if (metadata instanceof InputDefinition) {
					input = {
						property: property,
						name: exists(metadata.name) ? metadata.name : property,
						required: false,
					};

				} else if (metadata instanceof RequiredInputDefinition) {
					inputRequired = true;

				} else if (metadata instanceof OutputDefinition) {
					outputs.push({
						property: property,
						name: exists(metadata.name) ? metadata.name : property,
					});

				} else if (metadata instanceof HostElementDefinition) {
					let element: DirectiveDefinitionElement = {
						property: property,
					};

					if (metadata.selector) {
						element.selector = metadata.selector;
					}

					elements.push(element);

				} else if (metadata instanceof HostEventDefinition) {
					let event: DirectiveDefinitionEvent = {
						method: property,
						event: metadata.event,
					};

					if (metadata.selector && metadata.selector.charAt(0) === '@') {
						event.hostElement = metadata.selector.substring(1);

					} else if (metadata.selector) {
						event.selector = metadata.selector;
					}

					events.push(event);

				} else if (metadata instanceof ParentComponentDefinition) {
					parentComponents.push({
						property: property,
					});

				} else if (metadata instanceof ChildDirectiveDefinition) {
					childDirectives.push({
						property: property,
						directiveType: metadata.directiveType,
					});

				} else if (metadata instanceof ChildrenDirectiveDefinition) {
					childrenDirectives.push({
						property: property,
						directiveType: metadata.directiveType,
					});
				}
			});

			if (input) {
				if (inputRequired) {
					input.required = true;
				}

				inputs.push(input);
			}
		});

		let definition: DirectiveDefinition = {
			type: DirectiveDefinitionType.Directive,
			name: name,
			uniqueName: uniqueName,
			hash: directiveHash,
			selector: annotation.selector,
			onInit: isFunction(directiveType.prototype.onInit),
			onDestroy: isFunction(directiveType.prototype.onDestroy),
			onUpdate: isFunction(directiveType.prototype.onUpdate),
			onCheckUpdates: isFunction(directiveType.prototype.onCheckUpdates),
			inputs: inputs,
			outputs: outputs,
			elements: elements,
			events: events,
			parentComponents: parentComponents,
		};

		if (annotation.exportAs) {
			definition.exportAs = annotation.exportAs;
		}

		if (annotation instanceof ComponentAnnotationDefinition) {
			definition.type = DirectiveDefinitionType.Component;
			definition.template = annotation.template;
			definition.changeDetection = annotation.changeDetection;
			definition.childDirectives = childDirectives;
			definition.childrenDirectives = childrenDirectives;

			if (annotation.controllerAs) {
				definition.controllerAs = annotation.controllerAs;
			}

			let filters = unique(merge(this.filters, annotation.filters));

			definition.filters = map(filters, (filterType: ClassType<FilterInterface>) => {
				let metadata = <FilterDefinition>findAnnotation(filterType, FilterDefinition);

				if (!metadata) {
					throw new Error(`Class "${stringify(filterType)}" is not a valid filter and can not be used in "${definition.name}" directive.`);
				}

				return {
					filterType: filterType,
					metadata: {
						name: metadata.name,
						hash: this.getFilterHash(stringify(filterType), metadata),
					},
				};
			});

			definition.directives = map(annotation.directives, (directiveType: ClassType<any>): DirectiveDefinitionDirective => {
				return {
					directiveType: directiveType,
					metadata: this.load(directiveType),
				};
			});
		}

		this.loaded.emit({
			metadata: definition,
			directiveType: directiveType,
		});

		return this.definitions[uniqueName] = definition;
	}


	private getDirectiveHash(name: string, annotation: DirectiveAnnotationDefinition): number
	{
		let parts = [
			name,
			annotation.selector,
		];

		if (annotation instanceof ComponentAnnotationDefinition) {
			parts.push(annotation.template);
			parts.push(annotation.changeDetection + '');
			parts.push(map(annotation.directives, (directive: ClassType<any>) => stringify(directive)).join(''));
			parts.push(map(annotation.filters, (filter: ClassType<FilterInterface>) => stringify(filter)).join(''));
		}

		return hash(parts.join(''));
	}


	private getFilterHash(name: string, annotation: FilterDefinition): number
	{
		let parts = [
			name,
			annotation.name,
		];

		return hash(parts.join(''));
	}

}
