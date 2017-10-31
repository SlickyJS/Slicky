import {EventEmitter} from '../../';
import {expect} from 'chai';


describe('#EventEmitter', () => {

	describe('emit()', () => {

		it('should call listener', (done) => {
			let event = new EventEmitter<string>();

			event.subscribe((value: string) => {
				expect(value).to.be.equal('hello');
				done();
			});

			event.emit('hello');
		});

	});

});
