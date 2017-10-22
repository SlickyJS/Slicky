import {keys} from '@slicky/utils';
import {DefaultSerializer} from './defaultSerializer';
import {MultipartFormSerializer} from './multipartFormSerializer';
import {appendUrlParameters} from './helpers';
import {FilesList, HeadersList} from '../http';


export declare interface SerializerResult
{
	headers: HeadersList,
	url: string,
	data: string|Uint8Array,
}


export class Serializer
{


	public static parseData(method: string, url: string, data: any, files: FilesList, cb: (data: SerializerResult) => void): void
	{
		if (keys(files).length) {
			let boundary = '---------------------------' + Date.now().toString(16);

			MultipartFormSerializer.serialize(boundary, data, files, (data) => {
				cb({
					headers: {
						'Content-Type': 'multipart/form-data; boundary=' + boundary,
					},
					url: url,
					data: data,
				});
			});

		} else if (data !== null) {
			let headers: HeadersList = {};

			data = DefaultSerializer.serialize(data);

			if (method === 'POST') {
				headers['Content-Type'] = 'application/x-www-form-urlencoded';
			} else {
				url = appendUrlParameters(url, data);
				data = null;
			}

			cb({
				headers: headers,
				url: url,
				data: data,
			});

		} else {
			cb({
				headers: {},
				url: url,
				data: null,
			});
		}
	}

}
