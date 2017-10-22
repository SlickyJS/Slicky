import {forEach, isArray, isObject} from '@slicky/utils';


const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'CONNECT', 'OPTIONS', 'TRACE'];
const DESTRUCTIVE_HTTP_METHODS = ['PUT', 'POST', 'DELETE'];


export function isValidHttpMethod(method: string): boolean
{
	return HTTP_METHODS.indexOf(method) !== -1;
}


export function isDestructiveHttpMethod(method: string): boolean
{
	return DESTRUCTIVE_HTTP_METHODS.indexOf(method) > 0;
}


export function escapeString(str: string): string
{
	return str.replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
}


export function appendUrlParameter(url: string, name: string, value: string): string
{
	url += url.indexOf('?') !== -1 ? '&' : '?';
	url += name + '=' + value;

	return url;
}


export function appendUrlParameters(url: string, params: string): string
{
	url += url.indexOf('?') !== -1 ? '&' : '?';
	url += params;

	return url;
}


export function flattenData(data: any): any
{
	const result = [];

	const process = (data: any, prefix: string = null): any => {
		if (isArray(data) || isObject(data)) {
			forEach(data, (value: any, key: any) => {
				add(prefix, isArray(data) ? '' : key, value);
			});

		} else {
			add(prefix, '', data);
		}
	};

	const add = (prefix: string, name: string, value: string|number) => {
		name = prefix === null ? name : prefix + '[' + name + ']';

		if (isArray(value) || isObject(value)) {
			process(value, name);

		} else {
			value = (value === null || value === '') ? null : value;
			result.push([name, value]);
		}
	};

	process(data);

	return result;
}


export function isHistoryApiSupported()
{
	return window.history && history.pushState && window.history.replaceState && !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/);
}


export function parseHeaders(headers: string): any
{
	let  result = {};

	if (!headers) {
		return result;
	}

	let headerPairs = headers.split('\u000d\u000a');
	for (let i = 0; i < headerPairs.length; i++) {
		let headerPair = headerPairs[i];
		let index = headerPair.indexOf('\u003a\u0020');

		if (index > 0) {
			result[headerPair.substring(0, index)] = headerPair.substring(index + 2);
		}
	}

	return result;
}


/**
 * @see http://stackoverflow.com/a/32756572
 */
export function toASCII(str: string): string
{
	const diacritics = {
		a: 'ÀÁÂÃÄÅàáâãäåĀāąĄ',
		c: 'ÇçćĆčČ',
		d: 'đĐďĎ',
		e: 'ÈÉÊËèéêëěĚĒēęĘ',
		i: 'ÌÍÎÏìíîïĪī',
		l: 'łŁ',
		n: 'ÑñňŇńŃ',
		o: 'ÒÓÔÕÕÖØòóôõöøŌō',
		r: 'řŘ',
		s: 'ŠšśŚ',
		t: 'ťŤ',
		u: 'ÙÚÛÜùúûüůŮŪū',
		y: 'ŸÿýÝ',
		z: 'ŽžżŻźŹ',
	};

	forEach(diacritics, (letters: string, toLetter: string) => {
		forEach(letters.split(''), (fromLetter: string) => {
			if (str.indexOf(fromLetter) < 0) {
				return;
			}

			const toCaseLetter = fromLetter === fromLetter.toUpperCase() ? toLetter.toUpperCase() : toLetter;

			str = str.replace(new RegExp(fromLetter, 'g'), toCaseLetter);
		});
	});

	return str;
}
