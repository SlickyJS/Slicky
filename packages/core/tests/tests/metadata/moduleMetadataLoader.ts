import '../../bootstrap';

import {ModuleMetadataLoader, Module, Directive} from '../../../metadata';
import {expect} from 'chai';


let loader: ModuleMetadataLoader;


describe('#Metadata/ModuleMetadataLoader', () => {

	beforeEach(() => {
		loader = new ModuleMetadataLoader;
	});

	describe('loadFilter()', () => {

		it('should throw an error when using invalid filter', () => {
			class TestModule {}

			expect(() => {
				loader.loadModule(TestModule);
			}).to.throw(Error, 'Class "TestModule" is not a valid module.');
		});

		it('should load metadata for filter', () => {
			@Directive({
				selector: 'test-directive',
			})
			class TestDirective {}

			@Module({
				directives: [TestDirective],
			})
			class TestModule {}

			expect(loader.loadModule(TestModule)).to.be.eql({
				directives: [TestDirective],
			});
		});

	});

});
