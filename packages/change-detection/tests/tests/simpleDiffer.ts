import {SimpleDiffer} from '../../src/simpleDiffer';
import {expect} from 'chai';


describe('#SimpleDiffer', () => {

	describe('check()', () => {

		it('should not see any changes in object', () => {
			expect((new SimpleDiffer('test')).check('test')).to.be.equal(undefined);
		});

		it('should see change in scalar object', () => {
			expect((new SimpleDiffer('test')).check('hello')).to.be.eql({
				newValue: 'hello',
				oldValue: 'test',
			});
		});

	});

});
