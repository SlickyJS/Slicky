import {AbstractExtension, FilterInterface} from '@slicky/core';
import {DirectiveDefinition, DirectiveOptions, DirectiveDefinitionType} from '@slicky/core/metadata';
import {Translator} from '@slicky/translator';
import {ClassType} from '@slicky/lang';
import {exists} from '@slicky/utils';
import {Container, ProviderOptions} from '@slicky/di';
import {TranslatorFilter} from './translatorFilter';
import {ComponentTranslator} from './componentTranslator';


export class TranslatorExtension extends AbstractExtension
{


	private translator: Translator;


	constructor(locale: string)
	{
		super();

		this.translator = new Translator(locale);
	}


	public getServices(): Array<ProviderOptions>
	{
		return [
			{
				service: Translator,
				options: {
					useValue: this.translator,
				},
			},
		];
	}


	public getFilters(): Array<ClassType<FilterInterface>>
	{
		return [
			TranslatorFilter,
		];
	}


	public doUpdateDirectiveMetadata(directiveType: ClassType<any>, metadata: DirectiveDefinition, options: DirectiveOptions): void
	{
		if (metadata.type === DirectiveDefinitionType.Component && exists(options.translations)) {
			metadata.translations = options.translations;
		}
	}


	public doInitComponentContainer(container: Container, metadata: DirectiveDefinition, component: any): void
	{
		if (!exists(metadata.translations)) {
			return;
		}

		container.addService(ComponentTranslator, {
			useFactory: () => {
				let translator = this.translator.fork();
				translator.addMessages(metadata.translations);

				return new ComponentTranslator(translator);
			},
		});
	}

}
