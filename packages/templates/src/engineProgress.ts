import {clone} from '@slicky/utils';


export class EngineProgress
{


	public localVariables: Array<string> = [];

	public inTemplate: boolean = false;


	public fork(): EngineProgress
	{
		let inner = new EngineProgress;

		inner.localVariables = clone(this.localVariables);
		inner.inTemplate = this.inTemplate;

		return inner;
	}

}
