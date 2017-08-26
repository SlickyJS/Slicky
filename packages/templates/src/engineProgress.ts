import {clone} from '@slicky/utils';


export class EngineProgress
{


	public localVariables: Array<string> = [];


	public fork(): EngineProgress
	{
		let inner = new EngineProgress;
		inner.localVariables = clone(this.localVariables);

		return inner;
	}

}
