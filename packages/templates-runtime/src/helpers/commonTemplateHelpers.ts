import {ApplicationTemplate, EmbeddedTemplatesContainer} from '../templates';
import {IfHelper} from './ifHelper';
import {ForOfHelper} from './forOfHelper';


export class CommonTemplateHelpers
{


	public static install(template: ApplicationTemplate): void
	{
		template.addProvider('ifHelperFactory', (container: EmbeddedTemplatesContainer) => {
			return new IfHelper(container);
		});

		template.addProvider('forOfHelperFactory', (container: EmbeddedTemplatesContainer, item: string, index: string = null, trackBy: (item: any) => any = null) => {
			return new ForOfHelper(container, item, index, trackBy);
		});
	}

}
