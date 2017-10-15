import {keys, values} from './objects';


export function evalCode(code: string, parameters: {[name: string]: any} = {}): any
{
	'use strict';

	code =
		'return (function() {' +
		'"use strict"; ' +
		code +
		'}).call(this);'
	;

	let parametersKeys = <Array<string>>keys(parameters);
	let parametersValues = values(parameters);

	let fn = new Function(...parametersKeys, code);

	return fn(...parametersValues);
}
