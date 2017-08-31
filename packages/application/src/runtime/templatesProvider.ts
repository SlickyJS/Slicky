import {IPlatform, FilterInterface, DirectiveDefinitionFilter, DirectiveDefinition, ExtensionsManager} from '@slicky/core';
import {Container} from '@slicky/di';
import {ApplicationTemplate, BaseTemplate, Template} from '@slicky/templates-runtime';
import {forEach, isFunction} from '@slicky/utils';
import {DirectivesProvider} from './directivesProvider';


export class TemplatesProvider
{


	private platform: IPlatform;

	private extensions: ExtensionsManager;

	private applicationTemplate: ApplicationTemplate;

	private directivesProvider: DirectivesProvider;


	constructor(platform: IPlatform, extensions: ExtensionsManager, applicationTemplate: ApplicationTemplate, directivesProvider: DirectivesProvider)
	{
		this.platform = platform;
		this.extensions = extensions;
		this.applicationTemplate = applicationTemplate;
		this.directivesProvider = directivesProvider;
	}


	public createComponentTemplate(container: Container, parentTemplate: BaseTemplate, metadata: DirectiveDefinition, component: any): Template
	{
		let templateType = this.platform.compileComponentTemplate(metadata);
		let template: Template = new templateType(this.applicationTemplate, parentTemplate);

		template.disableProvidersFromParent();
		template.disableParametersFromParent();
		template.disableFiltersFromParent();

		template.addProvider('component', component);
		template.addProvider('container', container);
		template.addProvider('templatesProvider', this);
		template.addProvider('directivesProvider', this.directivesProvider);

		forEach(metadata.filters, (filterData: DirectiveDefinitionFilter) => {
			let filter = <FilterInterface>container.create(filterData.filterType);

			template.addFilter(filterData.metadata.name, (obj: any, args: Array<any>) => {
				return filter.transform(obj, ...args);
			});
		});

		return template;
	}


	public createFrom(hash: number, el: HTMLElement, parent: BaseTemplate, setup: (template: Template, component: any) => void = null): Template
	{
		let container = parent.getProvider('container').fork();

		let metadata = this.directivesProvider.getDirectiveMetadataByHash(hash);
		let component = this.directivesProvider.create(metadata.hash, el, container);

		this.extensions.doInitComponentContainer(container, metadata, component);

		let template = this.createComponentTemplate(container, parent, metadata, component);

		if (isFunction(setup)) {
			setup(template, component)
		}

		return template;
	}

}
