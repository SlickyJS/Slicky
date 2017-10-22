import {Queue} from './queue';
import {HTTPRequest} from '../http';


export class ImmediateQueue implements Queue
{


	public append(request: HTTPRequest, fn: (done?: () => void) => void): void
	{
		fn();
	}


	public isRunning(): boolean
	{
		return false;
	}


	public run(): void
	{

	}

}
