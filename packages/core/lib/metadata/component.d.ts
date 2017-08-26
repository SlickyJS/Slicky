import { ClassType } from '@slicky/lang';
import { DirectiveOptions, DirectiveAnnotationDefinition } from './directive';
import { ChangeDetectionStrategy } from '../changeDetection';
import { FilterInterface } from '../filters';
export interface ComponentOptions extends DirectiveOptions {
    controllerAs?: string;
    template: string;
    changeDetection?: ChangeDetectionStrategy;
    directives?: Array<ClassType<any>>;
    filters?: Array<ClassType<FilterInterface>>;
}
export declare class ComponentAnnotationDefinition extends DirectiveAnnotationDefinition {
    controllerAs: string;
    template: string;
    changeDetection: ChangeDetectionStrategy;
    directives: Array<ClassType<any>>;
    filters: Array<ClassType<FilterInterface>>;
    constructor(options: ComponentOptions);
}
export declare let Component: any;
