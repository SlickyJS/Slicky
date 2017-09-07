import '../../bootstrap';

import {OnInit, Directive, Input, Required, Output, HostElement, HostEvent, ParentComponent} from '../../../';
import {DirectiveMetadataLoader, DirectiveDefinitionType} from '../../../metadata';
import {ExtensionsManager} from '../../../extensions';
import {expect} from 'chai';


let loader: DirectiveMetadataLoader;


describe('#Metadata/Parser.directive/loader.load()', () => {

	beforeEach(() => {
		loader = new DirectiveMetadataLoader(new ExtensionsManager);
	});

	it('should throw an error for classes without @Directive() annotation', () => {
		class TestDirective {}

		expect(() => {
			loader.load(TestDirective);
		}).to.throw(Error, 'Class "TestDirective" is not a directive. Please add @Directive() or @Component() annotation.');
	});

	it('should get base definition of directive', () => {
		@Directive({
			selector: 'button',
			exportAs: 'btn',
		})
		class TestDirective {}

		let definition = loader.load(TestDirective);

		expect(definition).to.be.eql({
			type: DirectiveDefinitionType.Directive,
			name: 'TestDirective',
			uniqueName: 'TestDirective_9386130',
			hash: 9386130,
			selector: 'button',
			exportAs: 'btn',
			onInit: false,
			onDestroy: false,
			onUpdate: false,
			inputs: [],
			outputs: [],
			elements: [],
			events: [],
			parentComponents: [],
		});
	});

	it('should get base definition of directive without exportAs', () => {
		@Directive({
			selector: 'button',
		})
		class TestDirective {}

		let definition = loader.load(TestDirective);

		expect(definition).to.be.eql({
			type: DirectiveDefinitionType.Directive,
			name: 'TestDirective',
			uniqueName: 'TestDirective_9386130',
			hash: 9386130,
			selector: 'button',
			onInit: false,
			onDestroy: false,
			onUpdate: false,
			inputs: [],
			outputs: [],
			elements: [],
			events: [],
			parentComponents: [],
		});
	});

	it('should parse inputs', () => {
		@Directive({
			selector: 'button',
		})
		class TestDirective
		{


			@Input() notRequired;

			@Input('title') named;

			@Input() @Required() required;

			@Input('title') @Required() namedRequired;

		}

		let definition = loader.load(TestDirective);

		expect(definition).to.be.eql({
			type: DirectiveDefinitionType.Directive,
			name: 'TestDirective',
			uniqueName: 'TestDirective_9386130',
			hash: 9386130,
			selector: 'button',
			onInit: false,
			onDestroy: false,
			onUpdate: false,
			inputs: [
				{
					property: 'notRequired',
					name: 'notRequired',
					required: false,
				},
				{
					property: 'named',
					name: 'title',
					required: false,
				},
				{
					property: 'required',
					name: 'required',
					required: true,
				},
				{
					property: 'namedRequired',
					name: 'title',
					required: true,
				},
			],
			outputs: [],
			elements: [],
			events: [],
			parentComponents: [],
		});
	});

	it('should parse outputs', () => {
		@Directive({
			selector: 'button',
		})
		class TestDirective
		{


			@Output() click;

			@Output('hover') namedOutput;

		}

		let definition = loader.load(TestDirective);

		expect(definition).to.be.eql({
			type: DirectiveDefinitionType.Directive,
			name: 'TestDirective',
			uniqueName: 'TestDirective_9386130',
			hash: 9386130,
			selector: 'button',
			onInit: false,
			onDestroy: false,
			onUpdate: false,
			inputs: [],
			outputs: [
				{
					property: 'click',
					name: 'click',
				},
				{
					property: 'namedOutput',
					name: 'hover',
				},
			],
			elements: [],
			events: [],
			parentComponents: [],
		});
	});

	it('should parse host elements', () => {
		@Directive({
			selector: 'button',
		})
		class TestDirective
		{


			@HostElement() me;

			@HostElement('span') innerSpan;

		}

		let definition = loader.load(TestDirective);

		expect(definition).to.be.eql({
			type: DirectiveDefinitionType.Directive,
			name: 'TestDirective',
			uniqueName: 'TestDirective_9386130',
			hash: 9386130,
			selector: 'button',
			onInit: false,
			onDestroy: false,
			onUpdate: false,
			inputs: [],
			outputs: [],
			elements: [
				{
					property: 'me',
				},
				{
					property: 'innerSpan',
					selector: 'span',
				},
			],
			events: [],
			parentComponents: [],
		});
	});

	it('should parse host events', () => {
		@Directive({
			selector: 'button',
		})
		class TestDirective
		{


			@HostEvent('click')
			onMyEvent() {}


			@HostEvent('span', 'hover')
			onChildEvent() {}


			@HostEvent('@note', 'click')
			onHostElementEvent() {}

		}

		let definition = loader.load(TestDirective);

		expect(definition).to.be.eql({
			type: DirectiveDefinitionType.Directive,
			name: 'TestDirective',
			uniqueName: 'TestDirective_9386130',
			hash: 9386130,
			selector: 'button',
			onInit: false,
			onDestroy: false,
			onUpdate: false,
			inputs: [],
			outputs: [],
			elements: [],
			events: [
				{
					method: 'onMyEvent',
					event: 'click',
				},
				{
					method: 'onChildEvent',
					selector: 'span',
					event: 'hover',
				},
				{
					method: 'onHostElementEvent',
					hostElement: 'note',
					event: 'click',
				},
			],
			parentComponents: [],
		});
	});

	it('should parse parent component', () => {
		class TestDirectiveParent {}

		@Directive({
			selector: 'button',
		})
		class TestDirective
		{


			@ParentComponent() parent;

			@ParentComponent(TestDirectiveParent) specificParent;

		}

		let definition = loader.load(TestDirective);

		expect(definition).to.be.eql({
			type: DirectiveDefinitionType.Directive,
			name: 'TestDirective',
			uniqueName: 'TestDirective_9386130',
			hash: 9386130,
			selector: 'button',
			onInit: false,
			onDestroy: false,
			onUpdate: false,
			inputs: [],
			outputs: [],
			elements: [],
			events: [],
			parentComponents: [
				{
					property: 'parent',
				},
				{
					property: 'specificParent',
				},
			],
		});
	});

	it('should parse life cycle events', () => {
		@Directive({
			selector: 'button',
		})
		class TestDirective implements OnInit
		{


			public onInit(): void {}

		}

		let definition = loader.load(TestDirective);

		expect(definition).to.be.eql({
			type: DirectiveDefinitionType.Directive,
			name: 'TestDirective',
			uniqueName: 'TestDirective_9386130',
			hash: 9386130,
			selector: 'button',
			onInit: true,
			onDestroy: false,
			onUpdate: false,
			inputs: [],
			outputs: [],
			elements: [],
			events: [],
			parentComponents: [],
		});
	});

});
