import { ClassType } from '@slicky/lang';
import { EventEmitter } from '@slicky/event-emitter';
import { FilterInterface } from '../filters';
import { ExtensionsManager } from '../extensions';
export declare enum DirectiveDefinitionType {
    Directive = 0,
    Component = 1,
}
export interface DirectiveDefinitionInput {
    property: string;
    name: string;
    required: boolean;
}
export declare type DirectiveDefinitionInputsList = Array<DirectiveDefinitionInput>;
export interface DirectiveDefinitionOutput {
    property: string;
    name: string;
}
export declare type DirectiveDefinitionOutputsList = Array<DirectiveDefinitionOutput>;
export interface DirectiveDefinitionElement {
    property: string;
    selector?: string;
}
export declare type DirectiveDefinitionElementsList = Array<DirectiveDefinitionElement>;
export interface DirectiveDefinitionEvent {
    method: string;
    event: string;
    hostElement?: string;
    selector?: string;
}
export declare type DirectiveDefinitionEventsList = Array<DirectiveDefinitionEvent>;
export interface DirectiveDefinitionParentComponent {
    property: string;
}
export declare type DirectiveDefinitionParentComponentsList = Array<DirectiveDefinitionParentComponent>;
export interface DirectiveDefinitionChildDirective {
    property: string;
    directiveType: ClassType<any>;
}
export declare type DirectiveDefinitionChildDirectivesList = Array<DirectiveDefinitionChildDirective>;
export interface DirectiveDefinitionChildrenDirective {
    property: string;
    directiveType: ClassType<any>;
}
export declare type DirectiveDefinitionChildrenDirectivesList = Array<DirectiveDefinitionChildrenDirective>;
export interface DirectiveDefinitionDirective {
    directiveType: ClassType<any>;
    metadata: DirectiveDefinition;
}
export declare type DirectiveDefinitionDirectivesList = Array<DirectiveDefinitionDirective>;
export interface DirectiveDefinitionFilter {
    filterType: ClassType<FilterInterface>;
    metadata: {
        name: string;
        hash: number;
    };
}
export declare type DirectiveDefinitionFiltersList = Array<DirectiveDefinitionFilter>;
export interface DirectiveDefinition {
    type: DirectiveDefinitionType;
    name: string;
    uniqueName: string;
    hash: number;
    selector: string;
    controllerAs?: string;
    exportAs?: string;
    onInit: boolean;
    onDestroy: boolean;
    onUpdate: boolean;
    inputs: DirectiveDefinitionInputsList;
    outputs: DirectiveDefinitionOutputsList;
    elements: DirectiveDefinitionElementsList;
    events: DirectiveDefinitionEventsList;
    parentComponents: DirectiveDefinitionParentComponentsList;
    childDirectives?: DirectiveDefinitionChildDirectivesList;
    childrenDirectives?: DirectiveDefinitionChildrenDirectivesList;
    template?: string;
    directives?: DirectiveDefinitionDirectivesList;
    filters?: DirectiveDefinitionFiltersList;
    [name: string]: any;
}
export declare class DirectiveMetadataLoader {
    loaded: EventEmitter<DirectiveDefinitionDirective>;
    private extensions;
    private definitions;
    private filters;
    constructor(extensions: ExtensionsManager);
    addGlobalFilters(filters: Array<ClassType<FilterInterface>>): void;
    load(directiveType: ClassType<any>): DirectiveDefinition;
    private getDirectiveHash(name, annotation);
    private getFilterHash(name, annotation);
}
