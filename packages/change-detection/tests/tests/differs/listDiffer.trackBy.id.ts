import {ListDiffer, DifferAction} from '../../../src';
import {expect} from 'chai';


let trackBy = (item, index) => item.id;

let data = {
	a: {id: 0, char: 'a'},
	b: {id: 1, char: 'b'},
	c: {id: 2, char: 'c'},
};


describe('#Differs/ListDiffer.trackBy.id', () => {

	describe('check()', () => {

		it('should not see any changes in same array', () => {
			let obj = [data.a, data.b, data.c];
			let differ = new ListDiffer(obj, trackBy);

			expect(differ.check(obj)).to.be.eql([]);
		});

		it('should not see any changes in an array with same content', () => {
			let differ = new ListDiffer([data.a, data.b, data.c], trackBy);

			expect(differ.check([data.a, data.b, data.c])).to.be.eql([]);
		});

		it('should see removed items', () => {
			let differ = new ListDiffer([data.a, data.b, data.c], trackBy);

			expect(differ.check([data.a])).to.be.eql([
				{
					action: DifferAction.Remove,
					previousIndex: 1,
					previousItem: data.b,
					currentIndex: undefined,
					currentItem: undefined,
				},
				{
					action: DifferAction.Remove,
					previousIndex: 1,
					previousItem: data.c,
					currentIndex: undefined,
					currentItem: undefined,
				},
			]);

			expect(differ.check([data.a])).to.be.eql([]);
		});

		it('should see new item added to end', () => {
			let differ = new ListDiffer([data.a, data.b], trackBy);

			expect(differ.check([data.a, data.b, data.c])).to.be.eql([
				{
					action: DifferAction.Add,
					previousIndex: undefined,
					previousItem: undefined,
					currentIndex: 2,
					currentItem: data.c,
				},
			]);

			expect(differ.check([data.a, data.b, data.c])).to.be.eql([]);
		});

		it('should see items moved', () => {
			let differ = new ListDiffer([data.a, data.b], trackBy);

			expect(differ.check([data.b, data.a])).to.be.eql([
				{
					action: DifferAction.Move,
					previousIndex: 1,
					previousItem: data.b,
					currentIndex: 0,
					currentItem: data.b,
				},
			]);

			expect(differ.check([data.b, data.a])).to.be.eql([]);
		});

		it('should see changes', () => {
			let differ = new ListDiffer([], trackBy);

			expect(differ.check([])).to.be.eql([]);

			expect(differ.check([data.a])).to.be.eql([
				{
					action: DifferAction.Add,
					previousIndex: undefined,
					previousItem: undefined,
					currentIndex: 0,
					currentItem: data.a,
				},
			]);

			expect(differ.check([data.b])).to.be.eql([
				{
					action: DifferAction.Remove,
					previousIndex: 0,
					previousItem: data.a,
					currentIndex: undefined,
					currentItem: undefined,
				},
				{
					action: DifferAction.Add,
					previousIndex: undefined,
					previousItem: undefined,
					currentIndex: 0,
					currentItem: data.b,
				},
			]);

			expect(differ.check([data.a, data.b])).to.be.eql([
				{
					action: DifferAction.Add,
					previousIndex: undefined,
					previousItem: undefined,
					currentIndex: 0,
					currentItem: data.a,
				},
			]);

			expect(differ.check([data.b])).to.be.eql([
				{
					action: DifferAction.Remove,
					previousIndex: 0,
					previousItem: data.a,
					currentIndex: undefined,
					currentItem: undefined,
				},
			]);
		});

	});

});
