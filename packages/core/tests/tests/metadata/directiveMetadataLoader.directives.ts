import '../../bootstrap';

import {
	DirectiveMetadataLoader, Directive, Input, Required, Output, HostElement, HostEvent, ChildDirective,
	ChildrenDirective
} from '../../../metadata';
import {createDirectiveMetadata} from '../../helpers';
import {ExtensionsManager} from '../../../extensions';
import {OnInit, OnDestroy, OnTemplateInit, OnUpdate, OnAttach} from '../../../lifeCycleEvents';
import {expect} from 'chai';


let loader: DirectiveMetadataLoader;


describe('#Metadata/DirectiveMetadataLoader.directives', () => {

	beforeEach(() => {
		loader = new DirectiveMetadataLoader(new ExtensionsManager);
	});

	describe('loadDirective()', () => {

		it('should throw an error for classes without @Directive() or @Component() annotation', () => {
			class TestDirective {}

			expect(() => {
				loader.loadDirective(TestDirective);
			}).to.throw(Error, 'Class "TestDirective" is not a directive. Please add @Directive() or @Component() annotation.');
		});

		it('should load simple metadata for directive', () => {
			@Directive({
				selector: 'test-directive',
				exportAs: 'dir',
			})
			class TestDirective {}

			expect(loader.loadDirective(TestDirective)).to.be.eql(createDirectiveMetadata({
				exportAs: ['dir'],
			}));
		});

		it('should load metadata for directive with life cycle events', () => {
			@Directive({
				selector: 'test-directive',
			})
			class TestDirective implements OnInit, OnDestroy, OnTemplateInit, OnUpdate, OnAttach
			{

				public onInit(): void {}
				public onDestroy(): void {}
				public onTemplateInit(): void {}
				public onUpdate(): void {}
				public onAttach(): void {}

			}

			expect(loader.loadDirective(TestDirective)).to.be.eql(createDirectiveMetadata({
				onInit: true,
				onDestroy: true,
				onTemplateInit: true,
				onUpdate: true,
				onAttach: true,
			}));
		});

		it('should load inputs', () => {
			@Directive({
				selector: 'test-directive',
			})
			class TestDirective
			{

				@Input()
				public input;

				@Input('custom-name-input')
				public inputWithDifferentName;

				@Input()
				@Required()
				public inputRequired;

				@Input('custom-name-required-input')
				@Required()
				public inputRequiredWithDifferentName;

			}

			expect(loader.loadDirective(TestDirective)).to.be.eql(createDirectiveMetadata({
				inputs: [
					{
						name: 'input',
						property: 'input',
						required: false,
					},
					{
						name: 'custom-name-input',
						property: 'inputWithDifferentName',
						required: false,
					},
					{
						name: 'input-required',
						property: 'inputRequired',
						required: true,
					},
					{
						name: 'custom-name-required-input',
						property: 'inputRequiredWithDifferentName',
						required: true,
					},
				],
			}));
		});

		it('should load outputs', () => {
			@Directive({
				selector: 'test-directive',
			})
			class TestDirective
			{

				@Output()
				public output;

				@Output('custom-name-output')
				public outputWithDifferentName;

			}

			expect(loader.loadDirective(TestDirective)).to.be.eql(createDirectiveMetadata({
				outputs: [
					{
						property: 'output',
						name: 'output',
					},
					{
						property: 'outputWithDifferentName',
						name: 'custom-name-output',
					},
				],
			}));
		});

		it('should load elements', () => {
			@Directive({
				selector: 'test-directive',
			})
			class TestDirective
			{

				@HostElement('button')
				public el;

				@HostElement('div')
				@Required()
				public elRequired;

			}

			expect(loader.loadDirective(TestDirective)).to.be.eql(createDirectiveMetadata({
				elements: [
					{
						property: 'el',
						selector: 'button',
						required: false,
					},
					{
						property: 'elRequired',
						selector: 'div',
						required: true,
					},
				],
			}));
		});

		it('should throw an error when hostElement for hostEvent does not exists', () => {
			@Directive({
				selector: 'test-directive',
			})
			class TestDirective
			{

				@HostEvent('click', '@el')
				public event(): void {};

			}

			expect(() => {
				loader.loadDirective(TestDirective);
			}).to.throw(Error, 'Directive "TestDirective" has @HostEvent on "event" which points to @HostElement on "el" which does not exists.');
		});

		it('should load events', () => {
			@Directive({
				selector: 'test-directive',
			})
			class TestDirective
			{

				@HostElement('button')
				public el;

				@HostEvent('click')
				public event(): void {};

				@HostEvent('click', 'div')
				public eventWithSelector(): void {};

				@HostEvent('click', '@el')
				public eventWithHostElement(): void {};

			}

			expect(loader.loadDirective(TestDirective)).to.be.eql(createDirectiveMetadata({
				elements: [
					{
						property: 'el',
						selector: 'button',
						required: false,
					},
				],
				events: [
					{
						method: 'event',
						event: 'click',
					},
					{
						method: 'eventWithSelector',
						event: 'click',
						selector: 'div',
					},
					{
						method: 'eventWithHostElement',
						event: 'click',
						selector: 'button',
					},
				],
			}));
		});

		it('should load inner directives', () => {
			@Directive({
				selector: 'test-child-directive-a',
			})
			class TestChildDirectiveA {}

			@Directive({
				selector: 'test-child-directive-b',
			})
			class TestChildDirectiveB {}

			@Directive({
				selector: 'test-child-directive-c',
			})
			class TestChildDirectiveC {}

			@Directive({
				selector: 'test-directive',
				directives: [TestChildDirectiveA, [TestChildDirectiveB, TestChildDirectiveC], TestChildDirectiveC],
			})
			class TestDirective {}

			expect(loader.loadDirective(TestDirective)).to.be.eql(createDirectiveMetadata({
				directives: [
					{
						directiveType: TestChildDirectiveA,
						metadata: createDirectiveMetadata({
							id: 'TestChildDirectiveA',
							className: 'TestChildDirectiveA',
							selector: 'test-child-directive-a',
						}),
					},
					{
						directiveType: TestChildDirectiveB,
						metadata: createDirectiveMetadata({
							id: 'TestChildDirectiveB',
							className: 'TestChildDirectiveB',
							selector: 'test-child-directive-b',
						}),
					},
					{
						directiveType: TestChildDirectiveC,
						metadata: createDirectiveMetadata({
							id: 'TestChildDirectiveC',
							className: 'TestChildDirectiveC',
							selector: 'test-child-directive-c',
						}),
					},
				],
			}));

			expect(loader.loadInnerDirectives(TestDirective)).to.be.eql({
				TestChildDirectiveA: TestChildDirectiveA,
				TestChildDirectiveB: TestChildDirectiveB,
				TestChildDirectiveC: TestChildDirectiveC,
			});
		});

		it('should load child directives', () => {
			@Directive({
				selector: 'test-child-directive',
			})
			class TestChildDirective {}

			@Directive({
				selector: 'test-directive',
			})
			class TestDirective
			{

				@ChildDirective(TestChildDirective)
				public childDirective;

				@ChildDirective(TestChildDirective)
				@Required()
				public childDirectiveRequired;

			}

			expect(loader.loadDirective(TestDirective)).to.be.eql(createDirectiveMetadata({
				childDirectives: [
					{
						property: 'childDirective',
						required: false,
						directive: {
							directiveType: TestChildDirective,
							metadata: createDirectiveMetadata({
								id: 'TestChildDirective',
								className: 'TestChildDirective',
								selector: 'test-child-directive',
							}),
						},
					},
					{
						property: 'childDirectiveRequired',
						required: true,
						directive: {
							directiveType: TestChildDirective,
							metadata: createDirectiveMetadata({
								id: 'TestChildDirective',
								className: 'TestChildDirective',
								selector: 'test-child-directive',
							}),
						},
					},
				],
			}));
		});

		it('should load children directives', () => {
			@Directive({
				selector: 'test-child-directive',
			})
			class TestChildDirective {}

			@Directive({
				selector: 'test-directive',
			})
			class TestDirective
			{

				@ChildrenDirective(TestChildDirective)
				public childrenDirective;

			}

			expect(loader.loadDirective(TestDirective)).to.be.eql(createDirectiveMetadata({
				childrenDirectives: [
					{
						property: 'childrenDirective',
						directive: {
							directiveType: TestChildDirective,
							metadata: createDirectiveMetadata({
								id: 'TestChildDirective',
								className: 'TestChildDirective',
								selector: 'test-child-directive',
							}),
						},
					},
				],
			}));
		});

	});

});
