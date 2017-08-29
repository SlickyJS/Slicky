import { Realm } from '@slicky/realm';
import { ApplicationTemplate } from './applicationTemplate';
export declare type TemplateFilterCallback = (obj: any, args: Array<any>) => any;
export declare abstract class BaseTemplate {
    protected parent: BaseTemplate;
    protected children: Array<BaseTemplate>;
    protected application: ApplicationTemplate;
    protected realm: Realm;
    private providers;
    private providersFromParent;
    private parameters;
    private parametersFromParent;
    private filters;
    private filtersFromParent;
    private onDestroyed;
    constructor(application?: ApplicationTemplate, parent?: BaseTemplate);
    abstract refresh(): void;
    init(): void;
    destroy(): void;
    run(fn: () => any): any;
    onDestroy(fn: () => void): void;
    addProvider(name: string, provider: any): void;
    disableProvidersFromParent(): void;
    getProvider(name: string): any;
    disableParametersFromParent(): void;
    setParameters(parameters: {
        [name: string]: any;
    }): void;
    setParameter(name: string, value: any): void;
    getParameter(name: string): any;
    disableFiltersFromParent(): void;
    addFilter(name: string, fn: TemplateFilterCallback): void;
    getFilter(name: string, need?: boolean): TemplateFilterCallback;
    callFilter(name: string, modify: any, args?: Array<any>): any;
}
