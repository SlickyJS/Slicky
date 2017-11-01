import {Template} from '@slicky/templates';


export class ChangeDetector
{


	private template: Template;


	public setTemplate(template: Template): void
	{
		if (this.template) {
			throw new Error('ChangeDetectorRef is already initialized.');
		}

		this.template = template;
	}


	public refresh(): void
	{
		if (!this.template) {
			return;
		}

		this.template.refresh();
	}

}
