import {exists} from '@slicky/utils';
import {isValidHttpMethod} from '../utils';


export declare interface RequestOptions
{
	jsonp?: boolean|string,
	jsonPrefix?: string,
	mimeType?: string,
	headers?: HeadersList,
	files?: FilesList,
}


export declare interface HeadersList
{
	[name: string]: string,
}


export declare interface FileInfo
{
	filename: string,
	file: File|Blob,
}


export declare interface FilesList
{
	[name: string]: File|Blob|FileInfo,
}


export class HTTPRequest
{


	private static DEFAULT_JSONP_NAME = 'callback';


	public url: string;

	public method: string;

	public data: any = null;

	public files: FilesList = {};

	public jsonp: string;

	public jsonPrefix: string = null;

	public mimeType: string = null;

	public headers: HeadersList = {};


	constructor(url: string, method: string, data: any = null, options: RequestOptions = {})
	{
		method = method.toUpperCase();

		if (!isValidHttpMethod(method)) {
			throw new Error('HTTP method ' + method + ' is not allowed.');
		}

		if (options.jsonp && method !== 'GET') {
			throw new Error('JSONP can be used only with GET HTTP method.');
		}

		if (method === 'POST' && data !== null) {
			if (!exists(options.headers)) {
				options.headers = {};
			}

			if (!exists(options.headers['Content-Type'])) {
				options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
			}
		}

		this.url = url;
		this.method = method;
		this.data = data;

		if (options.files) {
			this.files = options.files;
		}

		if (options.jsonp) {
			this.jsonp = options.jsonp === true ? HTTPRequest.DEFAULT_JSONP_NAME : <string>options.jsonp;
		}

		if (options.jsonPrefix) {
			this.jsonPrefix = options.jsonPrefix;
		}

		if (options.mimeType) {
			this.mimeType = options.mimeType;
		}

		if (options.headers) {
			this.headers = options.headers;
		}
	}

}
