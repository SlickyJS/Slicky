import {EmbeddedTemplate, EmbeddedTemplatesContainer} from '../templates';


export class IfHelper
{


	private container: EmbeddedTemplatesContainer;

	private current: EmbeddedTemplate;


	constructor(container: EmbeddedTemplatesContainer)
	{
		this.container = container;
		this.container.onDestroy(() => this.destroy());
	}


	public destroy(): void
	{
		if (this.current) {
			this.current.destroy();
		}
	}


	public check(value: any): void
	{
		if (value && !this.current) {
			this.current = this.container.add();
		} else if (!value && this.current) {
			this.container.remove(this.current);
			this.current = null;
		}
	}

}
