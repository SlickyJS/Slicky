import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {HTTPRequest, RequestOptions, FilesList} from './request';
import {HTTPResponse} from './response';
import {Backend, XhrBackend} from '../backends';
import {Queue, AtomicQueue} from '../queues';


export declare interface HttpOptions
{
	backend?: Backend,
	queue?: Queue,
}


export class Http
{


	private backend: Backend;

	private queue: Queue;


	constructor(options: HttpOptions = {})
	{
		if (!options.backend) {
			options.backend = new XhrBackend;
		}

		if (!options.queue) {
			options.queue = new AtomicQueue;
		}

		this.backend = options.backend;
		this.queue = options.queue;
	}


	public request(url, method: string = 'GET', data: any = null, options: RequestOptions = {}): Observable<HTTPResponse>
	{
		return new Observable<HTTPResponse>((subscriber: Subscriber<HTTPResponse>) => {
			let request = new HTTPRequest(url, method, data, options);
			let stop = null;

			this.queue.append(request, (done?: () => void) => {
				stop = this.backend.fetch(request, (err: Error, response: HTTPResponse) => {
					if (done) {
						done();
					}

					if (err) {
						subscriber.error(err);

					} else {
						subscriber.next(response);
						subscriber.complete();
					}
				});
			});

			if (!this.queue.isRunning()) {
				this.queue.run();
			}

			return () => {
				if (stop) {
					stop();
				}
			};
		});
	}


	public get(url: string, data: any = null, options: RequestOptions = {}): Observable<HTTPResponse>
	{
		return this.request(url, 'GET', data, options);
	}


	public post(url: string, data: any = null, options: RequestOptions = {}): Observable<HTTPResponse>
	{
		return this.request(url, 'POST', data, options);
	}


	public files(url: string, files: FilesList = {}, data: any = null, options: RequestOptions = {}): Observable<HTTPResponse>
	{
		options.files = files;
		return this.request(url, 'POST', data, options);
	}

}
