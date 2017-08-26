import { RenderableTemplate } from './renderableTemplate';
import { ApplicationTemplate } from './applicationTemplate';
import { Template } from './template';
import { EmbeddedTemplatesContainer } from './embeddedTemplatesContainer';
export declare class EmbeddedTemplate extends RenderableTemplate {
    protected parent: RenderableTemplate;
    constructor(application: ApplicationTemplate, parent: EmbeddedTemplatesContainer, root: Template);
    refresh(): void;
    reload(): void;
}
