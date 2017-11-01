import '../bootstrap';

import {Realm} from '../../';
import {expect} from 'chai';


describe('#Realm', () => {

	describe('run()', () => {

		it('should run task', (done) => {
			let sequence = [];

			let realm = new Realm(() => {
				sequence.push('enter');
			}, () => {
				sequence.push('leave');
			});

			let result = realm.run(() => {
				setTimeout(() => {
					sequence.push('timeout 1');
				}, 10);
				setTimeout(() => {
					sequence.push('timeout 2');
				}, 20);

				return 'result of run';
			});

			expect(result).to.be.equal('result of run');

			setTimeout(() => {
				expect(sequence).to.be.eql(['enter', 'leave', 'enter', 'timeout 1', 'leave', 'enter', 'timeout 2', 'leave']);
				done();
			}, 50);
		});

	});

	describe('fork()', () => {

		it('should fork realm', () => {
			let realm = new Realm;
			let fork = realm.fork();

			expect(fork).to.be.an.instanceOf(Realm);
			expect(fork).to.not.be.equal(realm);
		});

	});

});
