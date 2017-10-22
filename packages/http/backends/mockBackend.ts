import {evalCode} from '@slicky/utils';
import {Backend} from './backend';
import {HTTPRequest, HTTPResponse, HeadersList} from '../http';
import {escapeString} from '../utils';


export declare interface MockReceiverOptions
{
	data: string|boolean,
	headers: HeadersList,
	statusCode: number,
	statusText: string,
	timeout: number,
}


export class MockBackend implements Backend
{


	private receiving: MockReceiverOptions = null;


	public fetch(request: HTTPRequest, cb: (err: Error, response: HTTPResponse) => void): Function
	{
		let response = new HTTPResponse;

		if (!this.receiving) {
			cb(null, new HTTPResponse);
			return;
		}

		setTimeout(() => {
			response.status = this.receiving.statusCode;
			response.headers = this.receiving.headers;

			if ((response.status >= 200 && response.status < 300) || response.status == 304) {
				if (response.status == 204 || request.method === 'HEAD') {
					response.statusText = 'nocontent';

				} else if (response.status === 304) {
					response.statusText = 'notmodified';

				} else {
					response.statusText = this.receiving.statusText;
					response.contentType = typeof this.receiving.headers['content-type'] === 'undefined' ? 'text/plain' : this.receiving.headers['content-type'];

					let data = this.receiving.data === true ? request.data : <string>this.receiving.data;

					if (request.jsonPrefix) {
						let prefix = escapeString(request.jsonPrefix);
						data = data.replace(new RegExp('^' + prefix), '');
					}

					if (request.jsonp) {
						evalCode(data, {
							callback: (data) => {
								response.data = data;
							},
						});

					} else {
						response.data = data;
					}
				}

				cb(null, response);
			} else {
				response.statusText = this.receiving.statusText;

				let error = new Error(`Error loading resource ${request.url} - server replied: ${response.statusText} (${response.status}).`);
				error['request'] = request;

				cb(error, null);
			}
		}, this.receiving.timeout);

		return () => {};
	}


	public receive(data: string = '', headers: HeadersList = {}, statusCode: number = 200, statusText: string = 'ok', timeout: number = 0): void
	{
		this.receiving = {
			data: data,
			headers: headers,
			statusCode: statusCode,
			statusText: statusText,
			timeout: timeout,
		};
	}


	public receiveAndResend(headers: HeadersList = {}, statusCode: number = 200, statusText: string = 'ok', timeout: number = 0): void
	{
		this.receiving = {
			data: true,
			headers: headers,
			statusCode: statusCode,
			statusText: statusText,
			timeout: timeout,
		};
	}

}
