import {Watcher} from '../../../templates';
import {Observable} from 'rxjs';
import {expect} from 'chai';


let watcher: Watcher;


describe('#Templates/Watcher', () => {

	beforeEach(() => {
		watcher = new Watcher;
	});

	describe('check', () => {

		it('should not see any changes', (done) => {
			let values = [0, 0];
			let updates = [];

			watcher.watch(() => values.shift(), (value) => updates.push(value));

			watcher.check((changed) => {
				expect(changed).to.be.equal(false);
				expect(updates).to.be.eql([0]);

				done();
			});
		});

		it('should see changes', (done) => {
			let values = [0, 1];
			let updates = [];

			watcher.watch(() => values.shift(), (value) => updates.push(value));

			watcher.check((changed) => {
				expect(changed).to.be.equal(true);
				expect(updates).to.be.eql([0, 1]);

				done();
			});
		});

		it('should see changes in observer', (done) => {
			let values = [0, 1];
			let updates = [];

			const observer = new Observable((subscriber) => {
				setTimeout(() => {
					subscriber.next(values.shift());
				}, 50);
			});

			watcher.watch(() => observer, (value) => updates.push(value));

			setTimeout(() => {
				watcher.check((changed) => {
					expect(changed).to.be.equal(true);
					expect(updates).to.be.eql([0, 1]);

					done();
				});
			}, 70);
		});

	});

});
