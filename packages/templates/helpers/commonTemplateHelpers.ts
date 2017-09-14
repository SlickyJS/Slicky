import {isFunction} from '@slicky/utils';
import {ApplicationTemplate, EmbeddedTemplatesContainer} from '../templates';
import {IfHelper} from './ifHelper';
import {ForOfHelper} from './forOfHelper';
import {ClassHelper} from './classHelper';


export class CommonTemplateHelpers
{


	public static install(template: ApplicationTemplate): void
	{
		template.addProvider('classHelperFactory', (el: HTMLElement, className: string, setup: (helper: ClassHelper) => void = null) => {
			let helper = new ClassHelper(el, className);

			if (isFunction(setup)) {
				setup(helper);
			}

			return helper;
		});

		template.addProvider('ifHelperFactory', (container: EmbeddedTemplatesContainer, setup: (helper: IfHelper) => void = null) => {
			let helper = new IfHelper(container);

			if (isFunction(setup)) {
				setup(helper);
			}

			return helper;
		});

		template.addProvider('forOfHelperFactory', (container: EmbeddedTemplatesContainer, item: string, index: string = null, trackBy: (item: any) => any = null, setup: (helper: ForOfHelper) => void = null) => {
			let helper = new ForOfHelper(container, item, index, trackBy);

			if (isFunction(setup)) {
				setup(helper);
			}

			return helper;
		});
	}

}