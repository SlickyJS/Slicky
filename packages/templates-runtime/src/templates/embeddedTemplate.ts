import {RenderableTemplate} from './renderableTemplate';
import {ApplicationTemplate} from './applicationTemplate';
import {Template} from './template';
import {EmbeddedTemplatesContainer} from './embeddedTemplatesContainer';


export class EmbeddedTemplate extends RenderableTemplate
{


	protected parent: RenderableTemplate;


	constructor(application: ApplicationTemplate, parent: EmbeddedTemplatesContainer, root: Template)
	{
		super(application, parent, root);
	}


	public refresh(): void
	{
		if (this.parent._refreshing > 0) {
			this.reload();

		} else {
			this.root.refresh();
		}
	}


	public reload(): void
	{
		super.refresh();
	}

}
