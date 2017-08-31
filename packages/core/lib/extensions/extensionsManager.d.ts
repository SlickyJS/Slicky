import { ClassType } from '@slicky/lang';
import { Container, ProviderOptions } from '@slicky/di';
import { AbstractExtension } from './abstractExtension';
import { DirectiveDefinition, DirectiveOptions } from '../metadata';
import { FilterInterface } from '../filters';
export declare class ExtensionsManager {
    private extensions;
    addExtension(extension: AbstractExtension): void;
    getServices(): Array<ProviderOptions>;
    getFilters(): Array<ClassType<FilterInterface>>;
    doUpdateDirectiveMetadata(directiveType: ClassType<any>, metadata: DirectiveDefinition, options: DirectiveOptions): void;
    doUpdateDirectiveServices(directiveType: ClassType<any>, metadata: DirectiveDefinition, services: Array<ProviderOptions>): void;
    doInitComponentContainer(container: Container, metadata: DirectiveDefinition, component: any): void;
    private callHook(name, ...args);
}
