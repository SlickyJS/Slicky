import {KeyValueDiffer, KeyValueChanges, KeyValueProperty, KeyValueChangeAction} from '../../src/keyValueDiffer';
import {expect} from 'chai';


let transformChanges = (changes: KeyValueChanges<any, any>) => {
	let result = [];
	changes.forEachAllActions((property: KeyValueProperty<any, any>) => result.push(property));

	return result;
};


describe('#KeyValueDiffer', () => {

	describe('check()', () => {

		it('should not see any changes in object', () => {
			expect((new KeyValueDiffer({a: 1, b: 2, c: 3})).check({a: 1, b: 2, c: 3})).to.be.equal(undefined);
		});

		it('should see update change in object', () => {
			let parameters = {a: 'a'};
			let differ = new KeyValueDiffer(parameters);

			parameters.a = 'aa';

			let changes = transformChanges(differ.check(parameters));

			expect(changes).to.be.eql([
				{
					action: KeyValueChangeAction.Update,
					property: 'a',
					newValue: 'aa',
					oldValue: 'a',
				},
			]);
		});

		it('should see new item in object', () => {
			let parameters = {a: 'a'};
			let differ = new KeyValueDiffer(parameters);

			parameters['b'] = 'b';

			let changes = transformChanges(differ.check(parameters));

			expect(changes).to.be.eql([
				{
					action: KeyValueChangeAction.Add,
					property: 'b',
					newValue: 'b',
					oldValue: undefined,
				},
			]);
		});

		it('should see removed item from object', () => {
			let parameters = {a: 'a'};
			let differ = new KeyValueDiffer(parameters);

			delete parameters.a;

			let changes = transformChanges(differ.check(parameters));

			expect(changes).to.be.eql([
				{
					action: KeyValueChangeAction.Remove,
					property: 'a',
					newValue: undefined,
					oldValue: 'a',
				},
			]);
		});

		it('should not see any changes in array', () => {
			expect((new KeyValueDiffer(['a'])).check(['a'])).to.be.eql(undefined);
		});

		it('should see update change in array', () => {
			let parameters = ['a'];
			let differ = new KeyValueDiffer(parameters);

			parameters[0] = 'aa';

			let changes = transformChanges(differ.check(parameters));

			expect(changes).to.be.eql([
				{
					action: KeyValueChangeAction.Update,
					property: 0,
					newValue: 'aa',
					oldValue: 'a',
				},
			]);
		});

		it('should see new item in array', () => {
			let parameters = ['a'];
			let differ = new KeyValueDiffer(parameters);

			parameters.push('b');

			let changes = transformChanges(differ.check(parameters));

			expect(changes).to.be.eql([
				{
					action: KeyValueChangeAction.Add,
					property: 1,
					newValue: 'b',
					oldValue: undefined,
				},
			]);
		});

		it('should see removed item from array', () => {
			let parameters = ['a'];
			let differ = new KeyValueDiffer(parameters);

			parameters.splice(0, 1);

			let changes = transformChanges(differ.check(parameters));

			expect(changes).to.be.eql([
				{
					action: KeyValueChangeAction.Remove,
					property: 0,
					newValue: undefined,
					oldValue: 'a',
				},
			]);
		});

		it('should see injected item into array', () => {
			let parameters = ['a', 'c'];
			let differ = new KeyValueDiffer(parameters);

			parameters.splice(1, 0, 'b');

			let changes = transformChanges(differ.check(parameters));

			expect(changes).to.be.eql([
				{
					action: KeyValueChangeAction.Update,
					property: 1,
					newValue: 'b',
					oldValue: 'c',
				},
				{
					action: KeyValueChangeAction.Add,
					property: 2,
					newValue: 'c',
					oldValue: undefined,
				},
			]);
		});

		it('should see remove item from middle of array', () => {
			let parameters = ['a', 'c', 'b'];
			let differ = new KeyValueDiffer(parameters);

			parameters.splice(1, 1);

			let changes = transformChanges(differ.check(parameters));

			expect(changes).to.be.eql([
				{
					action: KeyValueChangeAction.Remove,
					property: 2,
					newValue: undefined,
					oldValue: 'b',
				},
				{
					action: KeyValueChangeAction.Update,
					property: 1,
					newValue: 'b',
					oldValue: 'c',
				},
			]);
		});

		it('should add item into middle of array with tracking function', () => {
			let trackBy = (letter: string) => {
				return letter;
			};

			let parameters = ['a', 'c'];
			let differ = new KeyValueDiffer<number, string>(parameters, trackBy);

			parameters.splice(1, 0, 'b');

			let changes = transformChanges(differ.check(parameters));

			expect(changes).to.be.eql([
				{
					action: KeyValueChangeAction.Add,
					property: 1,
					newValue: 'b',
					oldValue: undefined,
				},
				{
					action: KeyValueChangeAction.Move,
					property: 2,
					newValue: 2,
					oldValue: 1,
				},
			]);
		});

		it('should remove item from middle of array with tracking function', () => {
			let trackBy = (letter: string) => {
				return letter;
			};

			let parameters = ['a', 'c', 'b'];
			let differ = new KeyValueDiffer(parameters, trackBy);

			parameters.splice(1, 1);

			let changes = transformChanges(differ.check(parameters));

			expect(changes).to.be.eql([
				{
					action: KeyValueChangeAction.Remove,
					property: 1,
					newValue: undefined,
					oldValue: 'c',
				},
				{
					action: KeyValueChangeAction.Move,
					property: 1,
					newValue: 1,
					oldValue: 2,
				},
			]);
		});

	});

});
