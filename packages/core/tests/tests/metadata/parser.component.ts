import {DirectiveMetadataLoader, Component, Directive, Filter, DirectiveDefinitionType, ChildDirective, ChildrenDirective, ChangeDetectionStrategy} from '../../../src';
import {expect} from 'chai';


let loader: DirectiveMetadataLoader;


describe('#Metadata/Parser.component/loader.load()', () => {

	beforeEach(() => {
		loader = new DirectiveMetadataLoader;
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
			changeDetection: ChangeDetectionStrategy.OnPush,
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
			uniqueName: 'TestComponent_1917302313',
			hash: 1917302313,
			selector: 'button',
			onInit: false,
			onDestroy: false,
			onCheckUpdates: false,
			onUpdate: false,
			inputs: [],
			outputs: [],
			elements: [],
			events: [],
			parentComponents: [],
			childDirectives: [],
			childrenDirectives: [],
			template: '<a>{{ title }}</a>',
			changeDetection: ChangeDetectionStrategy.OnPush,
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
						onCheckUpdates: false,
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
			uniqueName: 'TestComponent_2760019483',
			hash: 2760019483,
			selector: 'button',
			onInit: false,
			onDestroy: false,
			onCheckUpdates: false,
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
				},
			],
			childrenDirectives: [],
			template: '',
			changeDetection: ChangeDetectionStrategy.Default,
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
						onCheckUpdates: false,
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
			uniqueName: 'TestComponent_2760019483',
			hash: 2760019483,
			selector: 'button',
			onInit: false,
			onDestroy: false,
			onCheckUpdates: false,
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
			changeDetection: ChangeDetectionStrategy.Default,
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
						onCheckUpdates: false,
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
		});
	});

});
