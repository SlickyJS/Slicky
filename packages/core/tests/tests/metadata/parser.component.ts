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

	it('should throw an error when using invalid filter', () => {
		class TestFilter {}

		@Component({
			selector: 'box',
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
			selector: 'button',
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
			uniqueName: 'TestComponent_170994680',
			hash: 170994680,
			selector: 'button',
			onInit: false,
			onDestroy: false,
			onUpdate: false,
			inputs: [],
			outputs: [],
			elements: [],
			events: [],
			parentComponents: [],
			childDirectives: [],
			childrenDirectives: [],
			template: '<a>{{ title }}</a>',
			precompileDirectives: [],
			directives: [
				{
					directiveType: TestChildDirective,
					metadata: {
						type: DirectiveDefinitionType.Directive,
						name: 'TestChildDirective',
						uniqueName: 'TestChildDirective_3346656367',
						hash: 3346656367,
						selector: 'a',
						onInit: false,
						onDestroy: false,
						onUpdate: false,
						inputs: [],
						outputs: [],
						elements: [],
						events: [],
						parentComponents: [],
					},
				},
			],
			filters: [
				{
					filterType: TestFilter,
					metadata: {
						name: 'filter',
						hash: 1286105203,
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
			selector: 'button',
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
			uniqueName: 'TestComponent_1521399531',
			hash: 1521399531,
			selector: 'button',
			onInit: false,
			onDestroy: false,
			onUpdate: false,
			inputs: [],
			outputs: [],
			elements: [],
			events: [],
			parentComponents: [],
			childDirectives: [
				{
					property: 'child',
					directiveType: TestDirective,
					required: false,
					metadata: {
						type: DirectiveDefinitionType.Directive,
						name: 'TestDirective',
						uniqueName: 'TestDirective_455982085',
						hash: 455982085,
						selector: 'a',
						onInit: false,
						onDestroy: false,
						onUpdate: false,
						inputs: [],
						outputs: [],
						elements: [],
						events: [],
						parentComponents: [],
					},
				},
			],
			childrenDirectives: [],
			template: '',
			precompileDirectives: [],
			directives: [
				{
					directiveType: TestDirective,
					metadata: {
						type: DirectiveDefinitionType.Directive,
						name: 'TestDirective',
						uniqueName: 'TestDirective_455982085',
						hash: 455982085,
						selector: 'a',
						onInit: false,
						onDestroy: false,
						onUpdate: false,
						inputs: [],
						outputs: [],
						elements: [],
						events: [],
						parentComponents: [],
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
			selector: 'button',
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
			uniqueName: 'TestComponent_1521399531',
			hash: 1521399531,
			selector: 'button',
			onInit: false,
			onDestroy: false,
			onUpdate: false,
			inputs: [],
			outputs: [],
			elements: [],
			events: [],
			parentComponents: [],
			childDirectives: [],
			childrenDirectives: [
				{
					property: 'child',
					directiveType: TestDirective,
				},
			],
			template: '',
			precompileDirectives: [],
			directives: [
				{
					directiveType: TestDirective,
					metadata: {
						type: DirectiveDefinitionType.Directive,
						name: 'TestDirective',
						uniqueName: 'TestDirective_455982085',
						hash: 455982085,
						selector: 'a',
						onInit: false,
						onDestroy: false,
						onUpdate: false,
						inputs: [],
						outputs: [],
						elements: [],
						events: [],
						parentComponents: [],
					},
				},
			],
			filters: [],
			styles: [],
			encapsulation: TemplateEncapsulation.Emulated,
		});
	});

});
