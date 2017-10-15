import {evalCode} from '../..';
import {expect} from 'chai';


describe('#code', () => {

	describe('evalCode()', () => {

		it('should evaluate code with some values', () => {
			let scope = {
				a: 1,
				b: 2,
				c: 3,
			};

			let result = evalCode('return {a: c, b: b, c: a};', scope);

			expect(result).to.be.eql({
				a: 3,
				b: 2,
				c: 1,
			});
		});

	});

});
