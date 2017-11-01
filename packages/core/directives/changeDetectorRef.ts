import {ChangeDetector} from './changeDetector';


export class ChangeDetectorRef
{


	private changeDetector: ChangeDetector;


	constructor(changeDetector: ChangeDetector)
	{
		this.changeDetector = changeDetector;
	}


	public refresh(): void
	{
		this.changeDetector.refresh();
	}

}
