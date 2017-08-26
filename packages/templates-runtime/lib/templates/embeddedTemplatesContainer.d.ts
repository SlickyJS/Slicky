import { RenderableTemplate } from './renderableTemplate';
import { EmbeddedTemplate } from './embeddedTemplate';
import { ApplicationTemplate } from './applicationTemplate';
import { Template } from './template';
export declare type EmbeddedTemplateFactory = (template: EmbeddedTemplate, el: Node, setup: (template: EmbeddedTemplate) => void) => EmbeddedTemplate;
export declare class EmbeddedTemplatesContainer extends RenderableTemplate {
    protected children: Array<EmbeddedTemplate>;
    private el;
    private factory;
    constructor(application: ApplicationTemplate, el: Node, factory: EmbeddedTemplateFactory, parent?: RenderableTemplate, root?: Template);
    add(setup?: (template: EmbeddedTemplate) => void): EmbeddedTemplate;
    remove(template: EmbeddedTemplate): void;
    move(template: EmbeddedTemplate, index: number): void;
}
