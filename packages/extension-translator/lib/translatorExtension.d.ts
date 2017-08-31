import { AbstractExtension, FilterInterface, DirectiveDefinition, DirectiveOptions } from '@slicky/core';
import { ClassType } from '@slicky/lang';
import { Container, ProviderOptions } from '@slicky/di';
export declare class TranslatorExtension extends AbstractExtension {
    private translator;
    constructor(locale: string);
    getServices(): Array<ProviderOptions>;
    getFilters(): Array<ClassType<FilterInterface>>;
    doUpdateDirectiveMetadata(directiveType: ClassType<any>, metadata: DirectiveDefinition, options: DirectiveOptions): void;
    doInitComponentContainer(container: Container, metadata: DirectiveDefinition, component: any): void;
}
