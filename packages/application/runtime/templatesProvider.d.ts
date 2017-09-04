import { ExtensionsManager } from '@slicky/core/extensions';
import { DirectiveDefinition } from '@slicky/core/metadata';
import { Container } from '@slicky/di';
import { ApplicationTemplate, BaseTemplate, Template } from '@slicky/templates-runtime/templates';
import { DirectivesProvider } from './directivesProvider';
import { PlatformInterface } from '../platform';
export declare class TemplatesProvider {
    private platform;
    private extensions;
    private applicationTemplate;
    private directivesProvider;
    constructor(platform: PlatformInterface, extensions: ExtensionsManager, applicationTemplate: ApplicationTemplate, directivesProvider: DirectivesProvider);
    createComponentTemplate(container: Container, parentTemplate: BaseTemplate, metadata: DirectiveDefinition, component: any): Template;
    createFrom(hash: number, el: HTMLElement, parent: BaseTemplate, setup?: (template: Template, component: any) => void): Template;
}
