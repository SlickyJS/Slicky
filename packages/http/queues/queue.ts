import {HTTPRequest} from '../http';


export interface Queue
{


	append(request: HTTPRequest, fn: (done?: () => void) => void): void;

	isRunning(): boolean;

	run(): void;

}
