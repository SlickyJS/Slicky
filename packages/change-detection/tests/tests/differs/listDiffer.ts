import {ListDiffer, DifferAction} from '../../../src';
import {expect} from 'chai';


describe('#Differs/ListDiffer', () => {

	describe('check()', () => {

		it('should not see any changes in same array', () => {
			let obj = ['a', 'b', 'c'];
			let differ = new ListDiffer(obj);

			expect(differ.check(obj)).to.be.eql([]);
		});

		it('should not see any changes in an array with same content', () => {
			let differ = new ListDiffer(['a', 'b', 'c']);

			expect(differ.check(['a', 'b', 'c'])).to.be.eql([]);
		});

		it('should see removed items', () => {
			let differ = new ListDiffer(['a', 'b', 'c']);

			expect(differ.check(['a'])).to.be.eql([
				{
					action: DifferAction.Remove,
					previousIndex: 1,
					previousItem: 'b',
					currentIndex: undefined,
					currentItem: undefined,
				},
				{
					action: DifferAction.Remove,
					previousIndex: 1,
					previousItem: 'c',
					currentIndex: undefined,
					currentItem: undefined,
				},
			]);

			expect(differ.check(['a'])).to.be.eql([]);
		});

		it('should see new item added to end', () => {
			let differ = new ListDiffer(['a', 'b']);

			expect(differ.check(['a', 'b', 'c'])).to.be.eql([
				{
					action: DifferAction.Add,
					previousIndex: undefined,
					previousItem: undefined,
					currentIndex: 2,
					currentItem: 'c',
				},
			]);

			expect(differ.check(['a', 'b', 'c'])).to.be.eql([]);
		});

		it('should see items updated', () => {
			let differ = new ListDiffer(['a', 'b']);

			expect(differ.check(['b', 'a'])).to.be.eql([
				{
					action: DifferAction.Update,
					previousIndex: 0,
					previousItem: 'a',
					currentIndex: 0,
					currentItem: 'b',
				},
				{
					action: DifferAction.Update,
					previousIndex: 1,
					previousItem: 'b',
					currentIndex: 1,
					currentItem: 'a',
				},
			]);

			expect(differ.check(['b', 'a'])).to.be.eql([]);
		});

		it('should see changes', () => {
			let differ = new ListDiffer([]);

			expect(differ.check([])).to.be.eql([]);

			expect(differ.check(['a'])).to.be.eql([
				{
					action: DifferAction.Add,
					previousIndex: undefined,
					previousItem: undefined,
					currentIndex: 0,
					currentItem: 'a',
				},
			]);

			expect(differ.check(['b'])).to.be.eql([
				{
					action: DifferAction.Update,
					previousIndex: 0,
					previousItem: 'a',
					currentIndex: 0,
					currentItem: 'b',
				},
			]);

			expect(differ.check(['a', 'b'])).to.be.eql([
				{
					action: DifferAction.Update,
					previousIndex: 0,
					previousItem: 'b',
					currentIndex: 0,
					currentItem: 'a',
				},
				{
					action: DifferAction.Add,
					previousIndex: undefined,
					previousItem: undefined,
					currentIndex: 1,
					currentItem: 'b',
				},
			]);

			expect(differ.check(['b'])).to.be.eql([
				{
					action: DifferAction.Remove,
					previousIndex: 1,
					previousItem: 'b',
					currentIndex: undefined,
					currentItem: undefined,
				},
				{
					action: DifferAction.Update,
					previousIndex: 0,
					previousItem: 'a',
					currentIndex: 0,
					currentItem: 'b',
				},
			]);
		});

	});

});
