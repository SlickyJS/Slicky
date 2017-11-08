import '../../bootstrap';

import {TemplateEncapsulation} from '@slicky/templates/templates';
import {DirectiveMetadataLoader, Component, Filter} from '../../../metadata';
import {createComponentMetadata} from '../../helpers';
import {ExtensionsManager} from '../../../extensions';
import {FilterInterface} from '../../../filters';
import {expect} from 'chai';


let loader: DirectiveMetadataLoader;


describe('#Metadata/DirectiveMetadataLoader.components', () => {

	beforeEach(() => {
		loader = new DirectiveMetadataLoader(new ExtensionsManager);
	});

	describe('loadDirective()', () => {

		it('should throw an error when using invalid component name', () => {
			expect(() => {
				@Component({
					name: 'button',
				})
				class TestComponent {}
			}).to.throw(Error, 'Component element name "button" is not valid. Name must contain a dash and be all lowercased.');
		});

		it('should throw an error when template and render is missing', () => {
			expect(() => {
				@Component({
					name: 'my-component',
				})
				class TestComponent {}
			}).to.throw(Error, 'Component "my-component": missing template.');
		});

		it('should load component with template', () => {
			@Component({
				name: 'test-component',
				template: 'hello world',
			})
			class TestComponent {}

			expect(loader.loadDirective(TestComponent)).to.be.eql(createComponentMetadata({
				template: 'hello world',
			}));
		});

		it('should load component with different template encapsulation', () => {
			@Component({
				name: 'test-component',
				template: '',
				encapsulation: TemplateEncapsulation.Native,
			})
			class TestComponent {}

			expect(loader.loadDirective(TestComponent)).to.be.eql(createComponentMetadata({
				encapsulation: TemplateEncapsulation.Native,
			}));
		});

		it('should load component with filters', () => {
			@Filter({
				name: 'test-filter',
			})
			class TestFilter implements FilterInterface
			{

				public transform(value: any): any
				{
					return value;
				}

			}

			@Component({
				name: 'test-component',
				template: '',
				filters: [TestFilter, TestFilter],
			})
			class TestComponent {}

			expect(loader.loadDirective(TestComponent)).to.be.eql(createComponentMetadata({
				filters: [
					{
						filterType: TestFilter,
						metadata: {
							name: 'test-filter',
						},
					},
				],
			}));
		});

		it('should load global filters', () => {
			@Filter({
				name: 'test-filter',
			})
			class TestFilter implements FilterInterface
			{

				public transform(value: any): any
				{
					return value;
				}

			}

			@Component({
				name: 'test-component',
				template: '',
			})
			class TestComponent {}

			loader.addGlobalFilters([TestFilter]);

			expect(loader.loadDirective(TestComponent)).to.be.eql(createComponentMetadata({
				filters: [
					{
						filterType: TestFilter,
						metadata: {
							name: 'test-filter',
						},
					},
				],
			}));
		});

		it('should load styles', () => {
			@Component({
				name: 'test-component',
				template: '',
				styles: [
					'body {color: red;}',
					'button {border-color: blue;}',
				],
			})
			class TestComponent {}

			expect(loader.loadDirective(TestComponent)).to.be.eql(createComponentMetadata({
				styles: [
					'body {color: red;}',
					'button {border-color: blue;}',
				],
			}));
		});

	});

});
