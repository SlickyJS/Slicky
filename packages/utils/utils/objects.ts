export function getType(obj: any): string
{
	return Object.prototype.toString.call(obj);
}


export function isString(obj: any): boolean
{
	return typeof obj === 'string';
}


export function isNumber(obj: any): boolean
{
	return typeof obj === 'number';
}


export function isArray(obj: any): boolean
{
	return getType(obj) === '[object Array]';
}


export function isArrayLike(obj: any): boolean
{
	return isArray(obj) || getType(obj) === '[object NamedNodeMap]' || getType(obj) === '[object NodeList]';
}


export function isObject(obj: any): boolean
{
	return getType(obj) === '[object Object]';
}


export function isFunction(obj: any): boolean
{
	return getType(obj) === '[object Function]';
}


export function exists(obj: any): boolean
{
	return typeof obj !== 'undefined';
}


export function isIterable(obj: any): boolean
{
	return isArrayLike(obj) || isObject(obj);
}


export function forEach(obj: any, callback: (value: any, index: number|string, obj: any) => void): void
{
	if (isArrayLike(obj)) {
		if (exists(obj.forEach)) {
			obj.forEach(callback);

		} else {
			for (let i = 0; i < obj.length; i++) {
				callback(obj[i], i, obj);
			}
		}

	} else if (isObject(obj)) {
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				callback(obj[key], key, obj);
			}
		}

	} else {
		throw new Error(`Can not use forEach on type "${getType(obj)}".`);
	}
}


export function map(obj: any, callback: (value: any, index: number|string, obj: any) => void): any
{
	if (isArrayLike(obj) && exists(obj.map)) {
		return obj.map(callback);

	} else if (isIterable(obj)) {
		let result = isArrayLike(obj) ? [] : {};

		forEach(obj, (value: any, key: number|string) => {
			result[key] = callback(value, key, obj);
		});

		return result;

	} else {
		throw new Error(`Can not use map on type "${getType(obj)}".`);
	}
}


export function find(obj: any, callback: (value: any, index: number|string, obj: any) => void): any
{
	if (isArrayLike(obj) && exists(obj['find'])) {
		return obj['find'](callback);

	} else if (isArrayLike(obj)) {
		for (let i = 0; i < obj.length; i++) {
			if (callback(obj[i], i, obj)) {
				return obj[i];
			}
		}

	} else if (isObject(obj)) {
		for (let key in obj) {
			if (obj.hasOwnProperty(key) && callback(obj[key], key, obj)) {
				return obj[key];
			}
		}

	} else {
		throw new Error(`Can not use find on type "${getType(obj)}".`);
	}

	return undefined;
}


export function filter(obj: any, callback: (value: any, index: number|string, obj: any) => void): any
{
	if (isArrayLike(obj) && exists(obj.filter) && 0) {
		return obj.filter(callback);

	} else if (isArrayLike(obj)) {
		let result = [];

		forEach(obj, (value, index) => {
			if (callback(value, index, obj)) {
				result.push(value);
			}
		});

		return result;

	} else if (isObject(obj)) {
		let result = {};

		forEach(obj, (value, index) => {
			if (callback(value, index, obj)) {
				result[index] = value;
			}
		});

		return result;
	}

	throw new Error(`Can not use filter on type "${getType(obj)}".`);
}


export function clone(obj: any, deep: boolean = false): any
{
	if (isIterable(obj)) {
		return map(obj, (item: any) => {
			if (deep && isIterable(item)) {
				item = clone(item, deep);
			}

			return item;
		});

	} else {
		throw new Error(`Can not clone "${getType(obj)}" object.`);
	}
}


export function merge(a: any, b: any, deep: boolean = false): any
{
	if (getType(a) !== getType(b)) {
		throw new Error(`Can not merge "${getType(a)}" with "${getType(b)}".`);
	}

	if (isArrayLike(a) && exists(a.concat)) {
		return a.concat(b);

	} else if (isObject(a)) {
		let result = clone(a, deep);

		forEach(b, (item: any, key: number|string) => {
			if (deep && exists(result[key])) {
				item = merge(result[key], item, deep);
			}

			result[key] = item;
		});

		return result;

	} else {
		throw new Error(`Can not merge "${getType(a)}" objects.`);
	}
}


export function unique(obj: Array<any>): Array<any>
{
	let copy = [];

	forEach(obj, (value: any) => {
		if (copy.indexOf(value) < 0) {
			copy.push(value);
		}
	});

	return copy;
}


export function toArray(obj: any): Array<any>
{
	if (!isIterable(obj)) {
		throw new Error(`Can not cast "${getType(obj)}" to array.`);
	}

	if (isArrayLike(obj)) {
		return clone(obj);
	}

	if (isObject(obj)) {
		let result = [];

		forEach(obj, (item: any) => {
			result.push(item);
		});

		return result;
	}
}


export function keys(obj: any): Array<string|number>
{
	if (!isIterable(obj)) {
		throw new Error(`Can not get keys from "${getType(obj)}".`);
	}

	if (isObject(obj) && exists(Object.keys)) {
		return Object.keys(obj);
	}

	let result = [];

	forEach(obj, (value: any, index: number|string) => {
		result.push(index);
	});

	return result;
}


export function values(obj: any): Array<any>
{
	if (!isIterable(obj)) {
		throw new Error(`Can not get values from "${getType(obj)}".`);
	}

	if (isObject(obj) && exists(Object['values'])) {
		return Object['values'](obj);
	}

	let result = [];

	forEach(obj, (value: any) => {
		result.push(value);
	});

	return result;
}


export function flatten<T>(arr: Array<any>): Array<T>
{
	if (!isArray(arr)) {
		throw new Error(`flatten: only arrays are allowed, ${getType(arr)} given.`);
	}

	const result = [];

	const process = function(arr: Array<any>): void
	{
		forEach(arr, (value: any) => {
			if (isArray(value)) {
				process(value);
			} else {
				result.push(value);
			}
		});
	};

	process(arr);

	return result;
}


export function reverse<T>(arr: Array<T>): Array<T>
{
	if (!isArray(arr)) {
		throw new Error(`reverse: only arrays are allowed, ${getType(arr)} given.`);
	}

	const copy: Array<T> = clone(arr);
	copy.reverse();

	return copy;
}


export function sort<T>(arr: Array<T>, compare?: (a: T, b: T) => number): Array<T>
{
	if (!isArray(arr)) {
		throw new Error(`sort: only arrays are allowed, ${getType(arr)} given.`);
	}

	const copy: Array<T> = clone(arr);
	copy.sort(compare);

	return copy;
}


// from typescript
export function extend(child: any, parent: any): any
{
	let extendStatics =
		(<any>Object).setPrototypeOf ||
		({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
		function (d, b) { for (let p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

	extendStatics(child, parent);
	function __() { this.constructor = child; }
	child.prototype = parent === null ? Object.create(parent) : (__.prototype = parent.prototype, new __());
}
