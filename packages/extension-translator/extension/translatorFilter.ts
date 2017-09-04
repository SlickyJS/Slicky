import {FilterInterface, Filter} from '@slicky/core';
import {ParametersList} from '@slicky/translator';
import {ComponentTranslator} from './componentTranslator';


@Filter({
	name: 'translate',
})
export class TranslatorFilter implements FilterInterface
{


	private translator: ComponentTranslator;


	constructor(translator: ComponentTranslator)
	{
		this.translator = translator;
	}


	transform(message: any, countOrParameters: number|ParametersList = null, parameters: ParametersList = {}): string
	{
		return this.translator.translate(message, countOrParameters, parameters);
	}

}
