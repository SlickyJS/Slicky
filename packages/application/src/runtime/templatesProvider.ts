import {IPlatform} from '@slicky/core';
import {Container} from '@slicky/di';
import {ApplicationTemplate, BaseTemplate, Template} from '@slicky/templates-runtime';
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


	public createFrom(hash: number, parent: BaseTemplate): Template
	{
		let container: Container = parent.getProvider('container').fork();
		let directivesProvider: DirectivesProvider = parent.getProvider('directivesProvider');

		let templateType = this.platform.getTemplateTypeByHash(hash);
		let componentType = directivesProvider.getDirectiveTypeByHash(hash);

		let template: Template = new templateType(this.applicationTemplate, parent);

		template.disableProvidersFromParent();
		template.disableParametersFromParent();

		template.addProvider('component', container.create(componentType));
		template.addProvider('container', container);
		template.addProvider('templatesProvider', this);
		template.addProvider('directivesProvider', directivesProvider);

		return template;
	}

}
