import {IPlatform, FilterInterface, DirectiveDefinitionFilter} from '@slicky/core';
import {Container} from '@slicky/di';
import {ApplicationTemplate, BaseTemplate, Template} from '@slicky/templates-runtime';
import {forEach} from '@slicky/utils';
import {DirectivesProvider} from './directivesProvider';


export class TemplatesProvider
{


	private platform: IPlatform;

	private applicationTemplate: ApplicationTemplate;


	constructor(platform: IPlatform, applicationTemplate: ApplicationTemplate)
	{
		this.platform = platform;
		this.applicationTemplate = applicationTemplate;
	}


	public createFrom(hash: number, el: HTMLElement, parent: BaseTemplate): Template
	{
		let container: Container = parent.getProvider('container').fork();
		let directivesProvider: DirectivesProvider = parent.getProvider('directivesProvider');

		let templateType = this.platform.getTemplateTypeByHash(hash);
		let template: Template = new templateType(this.applicationTemplate, parent);
		let component = directivesProvider.create(hash, el, container);
		let metadata = directivesProvider.getDirectiveMetadataByHash(hash);

		template.disableProvidersFromParent();
		template.disableParametersFromParent();
		template.disableFiltersFromParent();

		template.addProvider('component', component);
		template.addProvider('container', container);
		template.addProvider('templatesProvider', this);
		template.addProvider('directivesProvider', directivesProvider);

		forEach(metadata.filters, (filterData: DirectiveDefinitionFilter) => {
			let filter = <FilterInterface>container.create(filterData.filterType);

			template.addFilter(filterData.metadata.name, (obj: any, args: Array<any>) => {
				return filter.transform(obj, ...args);
			});
		});

		return template;
	}

}
