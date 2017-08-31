import {Translator, ParametersList} from '@slicky/translator';
import {Injectable} from '@slicky/di';


@Injectable()
export class ComponentTranslator
{


	private translator: Translator;


	constructor(translator: Translator)
	{
		this.translator = translator;
	}


	public translate(message: any, countOrParameters: number|ParametersList = null, parameters: ParametersList = {}): string
	{
		return this.translator.translate(message, countOrParameters, parameters);
	}

}
