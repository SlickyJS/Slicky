import {forEach, evalCode} from '@slicky/utils';
import {Backend} from './backend';
import {Serializer, appendUrlParameter, parseHeaders, escapeString} from '../utils';
import {HTTPRequest, HTTPResponse} from '../http';


export class XhrBackend implements Backend
{


	public fetch(request: HTTPRequest, cb: (err: Error, response: HTTPResponse) => void): Function
	{
		let xhr = new XMLHttpRequest;
		let response = new HTTPResponse;
		let url = request.url;
		let inProgress = false;

		if (request.jsonp) {
			url = appendUrlParameter(url, request.jsonp, 'callback');
		}

		Serializer.parseData(request.method, url, request.data, request.files, (data) => {
			url = data.url;

			xhr.addEventListener('progress', (e: ProgressEvent) => {
				response.progress.next(e);
			});

			xhr.open(request.method, url, true);

			forEach(request.headers, (value: string, name: string) => {
				xhr.setRequestHeader(name, value);
			});

			if (url.match(/^(http)s?:\/\//) === null) {
				xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			}

			if (request.mimeType) {
				xhr.overrideMimeType(request.mimeType);
			}

			xhr.onreadystatechange = () => {
				if (xhr.readyState !== 4) {
					return;
				}

				inProgress = false;

				response.status = xhr.status;
				response.headers = parseHeaders(xhr.getAllResponseHeaders());

				if ((xhr.status < 200 || xhr.status > 300) && xhr.status !== 304) {
					let error = new Error('Error loading resource ' + request.url + ' - server replied: ' + xhr.statusText + ' (' + xhr.status + ').');
					error['request'] = request;
					cb(error, null);

					return;
				}

				if (xhr.status == 204 || request.method === 'HEAD') {
					response.statusText = 'nocontent';

				} else if (xhr.status === 304) {
					response.statusText = 'notmodified';

				} else {
					let responseData = xhr.responseText;

					response.statusText = xhr.statusText;
					response.contentType = xhr.getResponseHeader('content-type');

					if (request.jsonPrefix) {
						let prefix = escapeString(request.jsonPrefix);
						responseData = responseData.replace(new RegExp('^' + prefix), '');
					}

					if (request.jsonp) {
						evalCode(responseData, {
							callback: (data) => {
								response.data = data;
							},
						});

					} else {
						response.data = responseData;
					}
				}

				cb(null, response);
			};

			xhr.send(data.data);
			inProgress = true;
		});

		return () => {
			if (inProgress) {
				xhr.abort();
			}
		};
	}

}
