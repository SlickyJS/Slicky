import {isArray, getType} from '@slicky/utils';
import {DifferInterface, DifferTrackByFn} from './differ';
import {ListDiffer} from './listDiffer';


export class DifferFactory
{


	public create<T>(data: any, trackBy: DifferTrackByFn<T> = null): DifferInterface<T>
	{
		if (isArray(data)) {
			return new ListDiffer(data, trackBy);
		}

		throw new Error(`DifferFactory: can not create differ for "${getType(data)}"`);
	}

}
