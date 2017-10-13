import {Template} from '@slicky/templates';


export class ChangeDetectorRef
{


	private template: Template;


	public _initialize(template: Template): void
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
