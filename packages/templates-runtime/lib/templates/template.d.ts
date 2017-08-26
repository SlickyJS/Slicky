import { BaseTemplate } from './baseTemplate';
import { RenderableTemplate } from './renderableTemplate';
import { ApplicationTemplate } from './applicationTemplate';
import { EmbeddedTemplatesContainer, EmbeddedTemplateFactory } from './embeddedTemplatesContainer';
export declare abstract class Template extends RenderableTemplate {
    constructor(application: ApplicationTemplate, parent: BaseTemplate);
    static childTemplateExtend(child: any): void;
    abstract main(el: HTMLElement): void;
    render(el: HTMLElement): void;
    _createEmbeddedTemplatesContainer(parent: RenderableTemplate, el: Node, factory: EmbeddedTemplateFactory): EmbeddedTemplatesContainer;
}
