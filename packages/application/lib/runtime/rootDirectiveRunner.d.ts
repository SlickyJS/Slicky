import { DirectiveMetadataLoader, ExtensionsManager } from '@slicky/core';
import { ClassType } from '@slicky/lang';
import { Container } from '@slicky/di';
import { ApplicationTemplate } from '@slicky/templates-runtime';
import { PlatformInterface } from '../platform';
export declare class RootDirectiveRunner {
    private platform;
    private template;
    private container;
    private metadataLoader;
    private extensions;
    private el;
    private directivesProvider;
    private templatesProvider;
    constructor(platform: PlatformInterface, template: ApplicationTemplate, container: Container, metadataLoader: DirectiveMetadataLoader, extensions: ExtensionsManager, el: HTMLElement);
    run(directiveType: ClassType<any>): void;
    private runDirective(metadata, el);
    private runComponentTemplate(container, metadata, component, el);
}
