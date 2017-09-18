import {Watcher} from '../../../templates';

import {expect} from 'chai';


let watcher: Watcher;


describe('#Templates/Watcher', () => {

	beforeEach(() => {
		watcher = new Watcher;
	});

	describe('check', () => {

		it('should not see any changes', () => {
			let values = [0, 0];
			let updates = [];

			watcher.watch(() => values.shift(), (value) => updates.push(value));

			watcher.check();

			expect(updates).to.be.eql([0]);
		});

		it('should see changes', () => {
			let values = [0, 1];
			let updates = [];

			watcher.watch(() => values.shift(), (value) => updates.push(value));

			watcher.check();

			expect(updates).to.be.eql([0, 1]);
		});

	});

});
