import {TemplateParametersList} from './baseTemplate';
import {RenderableTemplate, RenderableEmbeddedTemplateFactory} from './renderableTemplate';
import {EmbeddedTemplatesContainer} from './embeddedTemplatesContainer';
import {Template} from './template';
import {ApplicationTemplate} from './applicationTemplate';
import {Renderer} from '../dom';


export class EmbeddedTemplate extends RenderableTemplate
{


	public parent: EmbeddedTemplatesContainer;


	constructor(document: Document, renderer: Renderer, application: ApplicationTemplate, root: Template, parent: EmbeddedTemplatesContainer, parameters: TemplateParametersList = {})
	{
		super(document, renderer, application, root, parent, parameters);
	}


	protected createEmbeddedTemplatesContainer(factory: RenderableEmbeddedTemplateFactory, marker: Comment): EmbeddedTemplatesContainer
	{
		return new EmbeddedTemplatesContainer(this.application, this.root, this, this.document, this.renderer, factory, marker);
	}

}
