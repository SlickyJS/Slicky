import {DefaultWatcherProvider} from '../../providers';

import {expect} from 'chai';


let watcher: DefaultWatcherProvider;


describe('#DefaultWatcherProvider', () => {

	beforeEach(() => {
		watcher = new DefaultWatcherProvider;
	});

	describe('check', () => {

		it('should not see any changes', () => {
			let values = [0, 0];
			let updates = [];

			watcher.watch([], () => values.shift(), (value) => updates.push(value));

			watcher.check();

			expect(updates).to.be.eql([0]);
		});

		it('should see changes', () => {
			let values = [0, 1];
			let updates = [];

			watcher.watch([], () => values.shift(), (value) => updates.push(value));

			watcher.check();

			expect(updates).to.be.eql([0, 1]);
		});

	});

});
