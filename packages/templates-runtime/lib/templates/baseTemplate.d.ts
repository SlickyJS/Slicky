import { Realm } from '@slicky/realm';
import { ApplicationTemplate } from './applicationTemplate';
export declare abstract class BaseTemplate {
    protected parent: BaseTemplate;
    protected children: Array<BaseTemplate>;
    protected application: ApplicationTemplate;
    protected realm: Realm;
    private providers;
    private providersFromParent;
    private parameters;
    private parametersFromParent;
    private onDestroyed;
    constructor(application?: ApplicationTemplate, parent?: BaseTemplate);
    abstract refresh(): void;
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
}
