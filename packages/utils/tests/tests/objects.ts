import {getType, isString, isNumber, isArray, isObject, isFunction, isIterable, exists, forEach, map, find, filter, unique, clone, merge, toArray, extend, keys, values} from '../..';
import {expect} from 'chai';


describe('#objects', () => {

	describe('getType()', () => {

		it('should get type of object', () => {
			expect(getType([])).to.be.equal('[object Array]');
		});

	});

	describe('isString()', () => {

		it('should be a string', () => {
			expect(isString('')).to.be.equal(true);
		});

		it('should not be a string', () => {
			expect(isString(1)).to.be.equal(false);
		});

	});

	describe('isNumber()', () => {

		it('should be a number', () => {
			expect(isNumber(1)).to.be.equal(true);
		});

		it('should not be a number', () => {
			expect(isNumber('')).to.be.equal(false);
		});

	});

	describe('isArray()', () => {

		it('should be an array', () => {
			expect(isArray([])).to.be.equal(true);
		});

		it('should not be an array', () => {
			expect(isArray({})).to.be.equal(false);
		});

	});

	describe('isObject()', () => {

		it('should be an object', () => {
			expect(isObject({})).to.be.equal(true);
		});

		it('should not be an object', () => {
			expect(isObject([])).to.be.equal(false);
		});

	});

	describe('isFunction()', () => {

		it('should be a function', () => {
			expect(isFunction(() => null)).to.be.equal(true);
		});

		it('should not be a function', () => {
			expect(isFunction([])).to.be.equal(false);
		});

	});

	describe('exists', () => {

		it('should return false for undefined', () => {
			expect(exists(undefined)).to.be.equal(false);
		});

		it('should return true for null', () => {
			expect(exists(null)).to.be.equal(true);
		});

		it('should return true for non nullable value', () => {
			expect(exists(true)).to.be.equal(true);
		});

	});

	describe('isIterable()', () => {

		it('should return true for an array', () => {
			expect(isIterable([])).to.be.equal(true);
		});

		it('should return false for an object', () => {
			expect(isIterable({})).to.be.equal(true);
		});

		it('should return false for non iterable objects', () => {
			expect(isIterable(false)).to.be.equal(false);
		});

	});

	describe('forEach()', () => {

		it('should throw an error when iterating through unsupported type', () => {
			expect(() => {
				forEach('', () => {});
			}).to.throw(Error, 'Can not use forEach on type "[object String]".');
		});

		it('should iterate through an array', () => {
			let copy = [];

			forEach(['a', 'b', 'c'], (value, i) => copy[i] = value);

			expect(copy).to.be.eql(['a', 'b', 'c']);
		});

		it('should iterate through an object', () => {
			let copy = {};

			forEach({a: 1, b: 2, c: 3}, (value, key) => copy[key] = value);

			expect(copy).to.be.eql({a: 1, b: 2, c: 3});
		});

	});

	describe('map()', () => {

		it('should throw an error when using map on unsupported type', () => {
			expect(() => {
				map('', () => {});
			}).to.throw(Error, 'Can not use map on type "[object String]".');
		});

		it('should map an array', () => {
			let a = map([1, 2, 3], (value: number) => {
				return value;
			});

			expect(a).to.be.eql([1, 2, 3]);
		});

		it('should map an object', () => {
			let a = map({a: 1, b: 2, c: 3}, (value: number) => {
				return value;
			});

			expect(a).to.be.eql({a: 1, b: 2, c: 3});
		});

	});

	describe('clone()', () => {

		it('should throw an error when trying to clone not supported type', () => {
			expect(() => {
				clone('');
			}).to.throw(Error, 'Can not clone "[object String]" object.');
		});

		it('should clone array', () => {
			let a = [1, 2, 3];
			let b = clone(a);

			expect(b).to.be.eql(a);
			expect(b).to.not.be.equal(a);
		});

		it('should not deeply clone array', () => {
			let a = [[]];
			let b = clone(a);

			expect(b[0]).to.be.equal(a[0]);
		});

		it('should deeply clone array', () => {
			let a = [[]];
			let b = clone(a, true);

			expect(b[0]).to.be.eql(a[0]);
			expect(b[0]).to.not.be.equal(a[0]);
		});

		it('should clone object', () => {
			let a = {a: 1, b: 2, c: 3};
			let b = clone(a);

			expect(b).to.be.eql(a);
			expect(b).to.not.be.equal(a);
		});

		it('should not deeply clone object', () => {
			let a = {a: {}};
			let b = clone(a);

			expect(b.a).to.be.equal(a.a);
		});

		it('should deeply clone object', () => {
			let a = {a: {}};
			let b = clone(a, true);

			expect(b.a).to.be.eql(a.a);
			expect(b.a).to.not.be.equal(a.a);
		});

	});

	describe('find()', () => {

		it('should throw an error when finding in non iterable type', () => {
			expect(() => {
				find('', () => {});
			}).to.throw(Error, 'Can not use find on type "[object String]".');
		});

		it('should not find any value in array', () => {
			expect(find([1, 2, 3], () => false)).to.be.equal(undefined);
		});

		it('should find value in array', () => {
			expect(find([1, 2, 3], (value) => value === 2)).to.be.equal(2);
		});

		it('should not find any value in an object', () => {
			expect(find({a: 1, b: 2, c: 3}, () => false)).to.be.equal(undefined);
		});

		it('should find value in an object', () => {
			expect(find({a: 1, b: 2, c: 3}, (value) => value === 2)).to.be.equal(2);
		});

	});

	describe('filter()', () => {

		it('should throw an error when filtering in non iterable type', () => {
			expect(() => {
				filter('', () => {});
			}).to.throw(Error, 'Can not use filter on type "[object String]".');
		});

		it('should not filter any value from array', () => {
			expect(filter([1, 2, 3], () => false)).to.be.eql([]);
		});

		it('should find value in array', () => {
			expect(filter([1, 2, 3], (value) => value === 2)).to.be.eql([2]);
		});

		it('should not find any value in an object', () => {
			expect(filter({a: 1, b: 2, c: 3}, () => false)).to.be.eql({});
		});

		it('should find value in an object', () => {
			expect(filter({a: 1, b: 2, c: 3}, (value) => value === 2)).to.be.eql({b: 2});
		});

	});

	describe('merge()', () => {

		it('should throw an error when trying to merge two different types', () => {
			expect(() => {
				merge([], {});
			}).to.throw(Error, 'Can not merge "[object Array]" with "[object Object]".');
		});

		it('should throw an error when trying to merge unsupported types', () => {
			expect(() => {
				merge(1, 1);
			}).to.throw(Error, 'Can not merge "[object Number]" objects.');
		});

		it('should merge arrays', () => {
			let a = [1, 2, 3];
			let b = [4, 5, 6];

			let r = merge(a, b);

			expect(r).to.be.eql([1, 2, 3, 4, 5, 6]);
			expect(r).to.not.be.equal(a);
			expect(r).to.not.be.equal(b);
		});

		it('should merge objects', () => {
			let a = {a: 1, b: 2, c: 3};
			let b = {d: 4, e: 5, f: 6};

			let r = merge(a, b);

			expect(r).to.be.eql({a: 1, b: 2, c: 3, d: 4, e: 5, f: 6});
			expect(r).to.not.be.equal(a);
			expect(r).to.not.be.equal(b);
		});

		it('should overwrite key when merge objects', () => {
			let a = {a: 1};
			let b = {a: 2};

			let r = merge(a, b);

			expect(r).to.be.eql({a: 2});
		});

		it('should deeply merge objects', () => {
			let a = {a: {a: [1]}};
			let b = {a: {a: [2]}};

			let r = merge(a, b, true);

			expect(r).to.be.eql({a: {a: [1, 2]}});
		});

	});

	describe('unique()', () => {

		it('should create new array with unique items', () => {
			let a = [1, 2, 2, 3, 3, 3, 4, 5, 5];
			let b = [1, 2, 3, 4, 5];

			let r = unique(a);

			expect(r).to.be.eql(b);
			expect(r).to.not.be.equal(a);
		});

	});

	describe('toArray()', () => {

		it('should throw an error for non iterable objects', () => {
			expect(() => {
				toArray('error');
			}).to.throw(Error, 'Can not cast "[object String]" to array.');
		});

		it('should clone array', () => {
			let a = [1, 2, 3, 4, 5];
			let b = toArray(a);

			expect(b).to.be.eql(a);
			expect(b).to.not.be.equal(a);
		});

		it('should clone object', () => {
			let a = {a: 1, b: 2, c: 3};
			let b = toArray(a);

			expect(b).to.be.eql([1, 2, 3]);
		});

	});

	describe('extend()', () => {

		it('should extend class', () => {
			let Parent = (() => {
				function Parent() {}
				Parent.prototype.callParent = function() {return 'parent';};
				return Parent;
			})();

			let Child: any = ((_super) => {
				extend(Child, _super);
				function Child()
				{
					return _super.apply(this, arguments);
				}
				Child.prototype.callChild = function() {return 'child';};
				return Child;
			})(Parent);

			let obj = new Child;

			expect(obj).to.be.an.instanceOf(Child);
			expect(obj).to.be.an.instanceOf(Parent);
			expect(obj.callChild()).to.be.equal('child');
			expect(obj.callParent()).to.be.equal('parent');
		});

	});

	describe('keys()', () => {

		it('should throw an error for non iterable object', () => {
			expect(() => {
				keys(5);
			}).to.throw(Error, 'Can not get keys from "[object Number]".');
		});

		it('should get keys from array', () => {
			expect(keys([1, 2, 3, 4, 5])).to.be.eql([0, 1, 2, 3, 4]);
		});

		it('should get keys from object', () => {
			expect(keys({a: 1, b: 2, c: 3})).to.be.eql(['a', 'b', 'c']);
		});

	});

	describe('values()', () => {

		it('should throw an error for non iterable object', () => {
			expect(() => {
				values(5);
			}).to.throw(Error, 'Can not get values from "[object Number]".');
		});

		it('should get keys from array', () => {
			expect(values([1, 2, 3, 4, 5])).to.be.eql([1, 2, 3, 4, 5]);
		});

		it('should get keys from object', () => {
			expect(values({a: 1, b: 2, c: 3})).to.be.eql([1, 2, 3]);
		});

	});

});
