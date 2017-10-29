import '../../bootstrap';

import {Component, Directive, Filter, ChildDirective, ChildrenDirective, TemplateEncapsulation} from '../../../';
import {DirectiveMetadataLoader, DirectiveDefinitionType} from '../../../metadata';
import {ExtensionsManager} from '../../../extensions';
import {expect} from 'chai';


let loader: DirectiveMetadataLoader;


describe('#Metadata/Parser.component/loader.load()', () => {

	beforeEach(() => {
		loader = new DirectiveMetadataLoader(new ExtensionsManager);
	});

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
		}).to.throw(Error, 'Component "my-component": missing template or render function.');
	});

	it('should throw an error when using invalid filter', () => {
		class TestFilter {}

		@Component({
			name: 'my-box',
			template: '',
			filters: [TestFilter],
		})
		class TestComponent {}

		expect(() => {
			loader.load(TestComponent);
		}).to.throw(Error, 'Class "TestFilter" is not a valid filter and can not be used in "TestComponent" directive.');
	});

	it('should get definition for component', () => {
		@Filter({
			name: 'filter',
		})
		class TestFilter {}

		@Directive({
			selector: 'a',
		})
		class TestChildDirective {}

		@Component({
			name: 'my-button',
			template: '<a>{{ title }}</a>',
			directives: [
				TestChildDirective,
			],
			filters: [
				TestFilter,
			],
		})
		class TestComponent {}

		let definition = loader.load(TestComponent);

		expect(definition).to.be.eql({
			type: DirectiveDefinitionType.Component,
			name: 'TestComponent',
			uniqueName: 'TestComponent_2662991551',
			id: '2662991551',
			selector: 'my-button',
			onInit: false,
			onDestroy: false,
			onTemplateInit: false,
			onUpdate: false,
			onAttach: false,
			inputs: [],
			outputs: [],
			elements: [],
			events: [],
			childDirectives: [],
			childrenDirectives: [],
			template: '<a>{{ title }}</a>',
			directives: [
				{
					directiveType: TestChildDirective,
					metadata: {
						type: DirectiveDefinitionType.Directive,
						name: 'TestChildDirective',
						uniqueName: 'TestChildDirective_3346656367',
						id: '3346656367',
						selector: 'a',
						onInit: false,
						onDestroy: false,
						onTemplateInit: false,
						onUpdate: false,
						onAttach: false,
						inputs: [],
						outputs: [],
						elements: [],
						events: [],
						directives: [],
						childDirectives: [],
						childrenDirectives: [],
					},
				},
			],
			filters: [
				{
					filterType: TestFilter,
					metadata: {
						name: 'filter',
						id: '1286105203',
					},
				},
			],
			styles: [],
			encapsulation: TemplateEncapsulation.Emulated,
		});
	});

	it('should parse child directives', () => {
		@Directive({
			selector: 'a',
		})
		class TestDirective {}

		@Component({
			name: 'my-button',
			directives: [TestDirective],
			template: '',
		})
		class TestComponent
		{


			@ChildDirective(TestDirective) child;

		}

		let definition = loader.load(TestComponent);

		expect(definition).to.be.eql({
			type: DirectiveDefinitionType.Component,
			name: 'TestComponent',
			uniqueName: 'TestComponent_1878199395',
			id: '1878199395',
			selector: 'my-button',
			onInit: false,
			onDestroy: false,
			onTemplateInit: false,
			onUpdate: false,
			onAttach: false,
			inputs: [],
			outputs: [],
			elements: [],
			events: [],
			childDirectives: [
				{
					property: 'child',
					directiveType: TestDirective,
					required: false,
					metadata: {
						type: DirectiveDefinitionType.Directive,
						name: 'TestDirective',
						uniqueName: 'TestDirective_455982085',
						id: '455982085',
						selector: 'a',
						onInit: false,
						onDestroy: false,
						onTemplateInit: false,
						onUpdate: false,
						onAttach: false,
						inputs: [],
						outputs: [],
						elements: [],
						events: [],
						directives: [],
						childDirectives: [],
						childrenDirectives: [],
					},
				},
			],
			childrenDirectives: [],
			template: '',
			directives: [
				{
					directiveType: TestDirective,
					metadata: {
						type: DirectiveDefinitionType.Directive,
						name: 'TestDirective',
						uniqueName: 'TestDirective_455982085',
						id: '455982085',
						selector: 'a',
						onInit: false,
						onDestroy: false,
						onTemplateInit: false,
						onUpdate: false,
						onAttach: false,
						inputs: [],
						outputs: [],
						elements: [],
						events: [],
						directives: [],
						childDirectives: [],
						childrenDirectives: [],
					},
				},
			],
			filters: [],
			styles: [],
			encapsulation: TemplateEncapsulation.Emulated,
		});
	});

	it('should parse children directives', () => {
		@Directive({
			selector: 'a',
		})
		class TestDirective {}

		@Component({
			name: 'my-button',
			directives: [TestDirective],
			template: '',
		})
		class TestComponent
		{


			@ChildrenDirective(TestDirective) child;

		}

		let definition = loader.load(TestComponent);

		expect(definition).to.be.eql({
			type: DirectiveDefinitionType.Component,
			name: 'TestComponent',
			uniqueName: 'TestComponent_1878199395',
			id: '1878199395',
			selector: 'my-button',
			onInit: false,
			onDestroy: false,
			onTemplateInit: false,
			onUpdate: false,
			onAttach: false,
			inputs: [],
			outputs: [],
			elements: [],
			events: [],
			childDirectives: [],
			childrenDirectives: [
				{
					property: 'child',
					directiveType: TestDirective,
				},
			],
			template: '',
			directives: [
				{
					directiveType: TestDirective,
					metadata: {
						type: DirectiveDefinitionType.Directive,
						name: 'TestDirective',
						uniqueName: 'TestDirective_455982085',
						id: '455982085',
						selector: 'a',
						onInit: false,
						onDestroy: false,
						onTemplateInit: false,
						onUpdate: false,
						onAttach: false,
						inputs: [],
						outputs: [],
						elements: [],
						events: [],
						directives: [],
						childDirectives: [],
						childrenDirectives: [],
					},
				},
			],
			filters: [],
			styles: [],
			encapsulation: TemplateEncapsulation.Emulated,
		});
	});

});
