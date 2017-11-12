import '../../bootstrap';

import {FilterMetadataLoader, Filter} from '../../../metadata';
import {FilterInterface} from '../../../filters';
import {expect} from 'chai';


let loader: FilterMetadataLoader;


describe('#Metadata/FilterMetadataLoader', () => {

	beforeEach(() => {
		loader = new FilterMetadataLoader;
	});

	describe('loadFilter()', () => {

		it('should throw an error when using invalid filter', () => {
			class TestFilter implements FilterInterface
			{

				public transform(value: any): any
				{
					return value;
				}

			}

			expect(() => {
				loader.loadFilter(TestFilter);
			}).to.throw(Error, 'Class "TestFilter" is not a valid filter.');
		});

		it('should load metadata for filter', () => {
			@Filter({
				name: 'test',
			})
			class TestFilter implements FilterInterface
			{

				public transform(value: any): any
				{
					return value;
				}

			}

			expect(loader.loadFilter(TestFilter)).to.be.eql({
				className: 'TestFilter',
				name: 'test',
			});
		});

	});

});
