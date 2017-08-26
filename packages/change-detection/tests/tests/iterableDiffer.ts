import {IterableDiffer, IterableChanges, IterableProperty, IterableChangeAction} from '../../src/iterableDiffer';
import {expect} from 'chai';


let transformChanges = (changes: IterableChanges<any>) => {
	let result = [];
	changes.forEachAllActions((property: IterableProperty<any>) => result.push(property));

	return result;
};


describe('#IterableDiffer', () => {

	describe('check()', () => {

		it('should not see any change', () => {
			let obj = ['a', 'b', 'c'];
			let differ = new IterableDiffer(obj);

			expect(differ.check(obj)).to.be.equal(undefined);
		});

		it('should see new item', () => {
			let obj = ['a', 'b', 'c'];
			let differ = new IterableDiffer(obj);

			obj.push('d');

			expect(transformChanges(differ.check(obj))).to.be.eql([
				{
					action: IterableChangeAction.Add,
					value: 'd',
				},
			]);
		});

		it('should see removed item', () => {
			let obj = ['a', 'b', 'c'];
			let differ = new IterableDiffer(obj);

			obj.splice(2, 1);

			expect(transformChanges(differ.check(obj))).to.be.eql([
				{
					action: IterableChangeAction.Remove,
					value: 'c',
				},
			]);
		});

	});

});
