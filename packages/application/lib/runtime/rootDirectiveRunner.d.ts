import { IPlatform, DirectiveMetadataLoader, ExtensionsManager } from '@slicky/core';
import { ClassType } from '@slicky/lang';
import { Container } from '@slicky/di';
import { ApplicationTemplate } from '@slicky/templates-runtime';
export declare class RootDirectiveRunner {
    private platform;
    private template;
    private container;
    private metadataLoader;
    private extensions;
    private document;
    private directivesProvider;
    private templatesProvider;
    constructor(platform: IPlatform, template: ApplicationTemplate, container: Container, metadataLoader: DirectiveMetadataLoader, extensions: ExtensionsManager, document: Document);
    run(directiveType: ClassType<any>): void;
    private runDirective(metadata, el);
    private runComponentTemplate(container, metadata, component, el);
}
