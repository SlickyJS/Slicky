import '../../bootstrap';

import {OnInit, OnDestroy, OnUpdate, OnAttach, Directive, Input, Required, Output, HostElement, HostEvent} from '../../../';
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
			uniqueName: 'TestDirective_2310870602',
			id: '2310870602',
			selector: 'button',
			exportAs: 'btn',
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
			id: '9386130',
			selector: 'button',
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
			id: '9386130',
			selector: 'button',
			onInit: false,
			onDestroy: false,
			onTemplateInit: false,
			onUpdate: false,
			onAttach: false,
			inputs: [
				{
					property: 'notRequired',
					name: 'not-required',
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
			directives: [],
			childDirectives: [],
			childrenDirectives: [],
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
			id: '9386130',
			selector: 'button',
			onInit: false,
			onDestroy: false,
			onTemplateInit: false,
			onUpdate: false,
			onAttach: false,
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
			directives: [],
			childDirectives: [],
			childrenDirectives: [],
		});
	});

	it('should parse host elements', () => {
		@Directive({
			selector: 'button',
		})
		class TestDirective
		{

			@HostElement('span') innerSpan;

		}

		let definition = loader.load(TestDirective);

		expect(definition).to.be.eql({
			type: DirectiveDefinitionType.Directive,
			name: 'TestDirective',
			uniqueName: 'TestDirective_9386130',
			id: '9386130',
			selector: 'button',
			onInit: false,
			onDestroy: false,
			onTemplateInit: false,
			onUpdate: false,
			onAttach: false,
			inputs: [],
			outputs: [],
			elements: [
				{
					property: 'innerSpan',
					selector: 'span',
					required: false,
				},
			],
			events: [],
			directives: [],
			childDirectives: [],
			childrenDirectives: [],
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


			@HostEvent('hover', 'span')
			onChildEvent() {}


			@HostEvent('click', '@note')
			onHostElementEvent() {}

		}

		let definition = loader.load(TestDirective);

		expect(definition).to.be.eql({
			type: DirectiveDefinitionType.Directive,
			name: 'TestDirective',
			uniqueName: 'TestDirective_9386130',
			id: '9386130',
			selector: 'button',
			onInit: false,
			onDestroy: false,
			onTemplateInit: false,
			onUpdate: false,
			onAttach: false,
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
			directives: [],
			childDirectives: [],
			childrenDirectives: [],
		});
	});

	it('should parse life cycle events', () => {
		@Directive({
			selector: 'button',
		})
		class TestDirective implements OnInit, OnDestroy, OnUpdate, OnAttach
		{


			public onInit(): void {}

			public onDestroy(): void {}

			public onUpdate(): void {}

			public onAttach(): void {}

		}

		let definition = loader.load(TestDirective);

		expect(definition).to.be.eql({
			type: DirectiveDefinitionType.Directive,
			name: 'TestDirective',
			uniqueName: 'TestDirective_9386130',
			id: '9386130',
			selector: 'button',
			onInit: true,
			onDestroy: true,
			onTemplateInit: false,
			onUpdate: true,
			onAttach: true,
			inputs: [],
			outputs: [],
			elements: [],
			events: [],
			directives: [],
			childDirectives: [],
			childrenDirectives: [],
		});
	});

});
