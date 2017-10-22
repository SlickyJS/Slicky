import {Queue} from './queue';
import {HTTPRequest} from '../http';
import {isDestructiveHttpMethod} from '../utils';


export declare interface QueueItem
{
	request: HTTPRequest,
	fn: (done: () => void) => void,
}


export class AtomicQueue implements Queue
{


	private requests: Array<QueueItem> = [];

	private running: boolean = false;


	public hasDestructiveRequests(): boolean
	{
		for (let i = 0; i < this.requests.length; i++) {
			if (isDestructiveHttpMethod(this.requests[i].request.method)) {
				return true;
			}
		}

		return false;
	}


	public append(request: HTTPRequest, fn: (done?: () => void) => void): void
	{
		if (!isDestructiveHttpMethod(request.method) && !this.hasDestructiveRequests()) {
			fn();
			return;
		}

		this.requests.push({
			request: request,
			fn: fn,
		});
	}


	public isRunning(): boolean
	{
		return this.running === true;
	}


	public run(): void
	{
		if (!this.requests.length) {
			this.running = false;
			return;
		}

		this.running = true;

		let item = <QueueItem>this.requests.shift();

		item.fn(() => {
			this.run();
		});
	}

}
