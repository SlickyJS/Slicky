import {exists} from './objects';


export function stringify(token: any): string
{
	if (typeof token === 'string') {
		return token;
	}

	if (token == null) {
		return '' + token;
	}

	if (token.name) {
		return `${token.name}`;
	}

	let s = token.toString();
	let newLinePos = s.indexOf('\n');

	return newLinePos === -1 ? s : s.substring(0, newLinePos);
}


export function hyphensToCamelCase(str: string): string
{
	return str.replace(/-([a-z])/g, (match) => match[1].toUpperCase());
}


export function camelCaseToHyphens(str: string): string
{
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}


export function firstUpper(str: string): string
{
	return str.charAt(0).toUpperCase() + str.slice(1);
}


export function startsWith(str: string, search: string, caseSensitive: boolean = true): boolean
{
	if (!caseSensitive) {
		str = str.toLowerCase();
		search = search.toLowerCase();
	}

	if (exists(str['startsWith'])) {
		return str['startsWith'](search);
	}

	return str.substr(0, search.length) === search;
}


export function endsWith(str: string, search: string, caseSensitive: boolean = true): boolean
{
	if (!caseSensitive) {
		str = str.toLowerCase();
		search = search.toLowerCase();
	}

	if (exists(str['endsWith'])) {
		return str['endsWith'](search);
	}

	return str.length >= search.length && str.substr(str.length - search.length) === search;
}


export function includes(str: string, search: string, caseSensitive: boolean = true): boolean
{
	if (!caseSensitive) {
		str = str.toLowerCase();
		search = search.toLowerCase();
	}

	if (exists(str['includes'])) {
		return str['includes'](search);
	}

	return str.length >= search.length && str.indexOf(search) >= 0;
}


// see https://github.com/darkskyapp/string-hash
export function hash(str: string): number
{
	let hash = 5381;
	let i = str.length;

	while (i) {
		hash = (hash * 33) ^ str.charCodeAt(--i);
	}

	return hash >>> 0;
}


export function indent(str: string, count: number = 1, indent: string = '\t', from: number = 0): string
{
	let index = 0;
	let replace = new Array(count + 1).join(indent);

	return str.replace(/^(?!\s*$)/mg, (match: string) => {
		return index++ >= from ? replace : match;
	});
}


export function escapeRegExp(str: string): string
{
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
