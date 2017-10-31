import '../bootstrap';

import {Directive, Component, HostElement, HostEvent, Input, Required, Output, ChildDirective, ChildrenDirective, OnInit, OnDestroy, OnTemplateInit} from '@slicky/core';
import {DirectiveMetadataLoader} from '@slicky/core/metadata';
import {ExtensionsManager} from '@slicky/core/extensions';
import {readFileSync} from 'fs';
import * as path from 'path';
import {Compiler} from '../..';

import {expect} from 'chai';


function compareWith(name: string): string
{
	return <string>readFileSync(path.join(__dirname, '..', '_compare', `${name}.js`), {encoding: 'utf-8'});
}


let metadataLoader: DirectiveMetadataLoader;
let compiler: Compiler;


describe('#Compiler', () => {

	beforeEach(() => {
		metadataLoader = new DirectiveMetadataLoader(new ExtensionsManager);
		compiler = new Compiler;
	});

	describe('compile()', () => {

		it('should not compile directive', () => {
			@Directive({
				selector: 'div',
			})
			class TestDirective {}

			expect(compiler.compile(metadataLoader.load(TestDirective))).to.be.equal(undefined);
		});

		it('should compile simple component', () => {
			@Component({
				name: 'my-component',
				template: '',
			})
			class TestComponent {}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.simple'));
		});

		it('should compile component with directive', () => {
			@Directive({
				selector: 'directive',
			})
			class TestChildDirective {}

			@Component({
				name: 'my-child',
				template: '',
			})
			class TestChildComponent {}

			@Component({
				name: 'my-component',
				template: '<directive></directive><my-child></my-child>',
				directives: [TestChildDirective, TestChildComponent],
			})
			class TestParentComponent {}

			expect(compiler.compile(metadataLoader.load(TestParentComponent))).to.be.equal(compareWith('compiler.directive'));
		});

		it('should throw an error when required @HostElement inside of @Directive is missing', () => {
			@Directive({
				selector: 'directive',
			})
			class TestDirective
			{

				@HostElement('i')
				@Required()
				public el;

			}

			@Component({
				name: 'my-component',
				template: '<directive></directive>',
				directives: [TestDirective],
			})
			class TestComponent {}

			const metadata = metadataLoader.load(TestComponent);

			expect(() => {
				compiler.compile(metadata);
			}).to.throw(Error, 'TestDirective.el: required @HostElement was not found.');
		});

		it('should throw an error when required @HostElement is missing', () => {
			@Component({
				name: 'my-component',
				template: '',
			})
			class TestComponent
			{

				@HostElement('i')
				@Required()
				public el;

			}

			const metadata = metadataLoader.load(TestComponent);

			expect(() => {
				compiler.compile(metadata);
			}).to.throw(Error, 'TestComponent.el: required @HostElement was not found.');
		});

		it('should include host element into component and inner directive', () => {
			@Directive({
				selector: 'test-directive',
			})
			class TestDirective
			{

				@HostElement('span')
				public el;

			}

			@Component({
				name: 'test-component',
				template: '<test-directive><span></span></test-directive><i></i>',
				directives: [TestDirective],
			})
			class TestComponent
			{

				@HostElement('i')
				public el;

			}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.hostElements'));
		});

		it('should throw an error when required input is missing', () => {
			@Directive({
				selector: 'directive',
			})
			class TestDirective
			{

				@Input()
				@Required()
				public requiredInput;

			}

			@Component({
				name: 'test-component',
				template: '<directive></directive>',
				directives: [TestDirective],
			})
			class TestComponent {}

			let metadata = metadataLoader.load(TestComponent);

			expect(() => {
				compiler.compile(metadata);
			}).to.throw(Error, 'TestDirective.requiredInput: required input is not set in <directive> tag.');
		});

		it('should inject imports to inner directive', () => {
			@Directive({
				selector: 'directive-child',
			})
			class TestDirectiveChild
			{

				@Input()
				public attributeInput;

				@Input('attribute-custom')
				public attributeInputCustom;

				@Input('attribute-watch')
				public attributeInputWatch;

				@Input()
				public propertyInput;

				@Input('property-custom')
				public propertyInputCustom;

			}
			@Component({
				name: 'component-child',
				template: '',
			})
			class TestComponentChild
			{

				@Input()
				public attributeInput;

				@Input('attribute-custom')
				public attributeInputCustom;

				@Input('attribute-watch')
				public attributeInputWatch;

				@Input()
				public propertyInput;

				@Input('property-custom')
				public propertyInputCustom;

			}

			@Component({
				name: 'test-component',
				template: [
					'<directive-child attribute-input="attr" attribute-custom="custom" attribute-watch="{{ null }}" [property-input]="true" [property-custom]="false"></directive-child>',
					'<component-child attribute-input="attr" attribute-custom="custom" attribute-watch="{{ null }}" [property-input]="true" [property-custom]="false"></component-child>',
				].join(''),
				directives: [TestDirectiveChild, TestComponentChild],
			})
			class TestComponentParent {}

			expect(compiler.compile(metadataLoader.load(TestComponentParent))).to.be.equal(compareWith('compiler.inputs'));
		});

		it('should not import undefined input', () => {
			@Directive({
				selector: 'test-directive',
			})
			class TestDirective
			{

				@Input()
				public input;

			}

			@Component({
				name: 'test-component',
				template: '<test-directive></test-directive>',
				directives: [TestDirective],
			})
			class TestComponent {}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.inputs.undefined'));
		});

		it('should compile outputs', () => {
			@Directive({
				selector: 'directive-child',
			})
			class TestDirectiveChild
			{

				@Output()
				public output;

				@Output('output-custom')
				public outputCustom;

			}

			@Component({
				name: 'component-child',
				template: '',
			})
			class TestComponentChild
			{

				@Output()
				public output;

				@Output('output-custom')
				public outputCustomName;

			}

			@Component({
				name: 'test-component',
				template: [
					'<directive-child (output)="do()" (output-custom)="doOther()"></directive-child>',
					'<component-child (output)="do()" (output-custom)="doOther()"></component-child>',
				].join(''),
				directives: [TestDirectiveChild, TestComponentChild],
			})
			class TestComponentParent {}

			expect(compiler.compile(metadataLoader.load(TestComponentParent))).to.be.equal(compareWith('compiler.outputs'));
		});

		it('should not set @ChildDirective from <template>', () => {
			@Directive({
				selector: 'directive',
			})
			class TestDirective {}

			@Component({
				name: 'test-component',
				template: '<template><directive></directive></template>',
				directives: [TestDirective],
			})
			class TestComponent
			{

				@ChildDirective(TestDirective)
				public directive;

			}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.childDirective.template'));
		});

		it('should not set @ChildDirective from <template> for directive', () => {
			@Directive({
				selector: 'child-directive',
			})
			class TestChildDirective {}

			@Directive({
				selector: 'parent-directive',
			})
			class TestParentDirective
			{

				@ChildDirective(TestChildDirective)
				public directive;

			}

			@Component({
				name: 'test-component',
				template: '<template><parent-directive></parent-directive></template>',
				directives: [TestChildDirective, TestParentDirective],
			})
			class TestComponent {}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.childDirective.directives.template'));
		});

		it('should throw an error when @ChildDirective is missing', () => {
			@Directive({
				selector: 'directive',
			})
			class TestDirective {}

			@Component({
				name: 'test-component',
				template: '',
				directives: [TestDirective],
			})
			class TestComponent
			{

				@ChildDirective(TestDirective)
				@Required()
				public directive;

			}

			const metadata = metadataLoader.load(TestComponent);

			expect(() => {
				compiler.compile(metadata);
			}).to.throw(Error, 'TestComponent.directive: required @ChildDirective TestDirective was not found.');
		});

		it('should throw an error when @ChildDirective for directive is missing', () => {
			@Directive({
				selector: 'child-directive',
			})
			class TestChildDirective {}

			@Directive({
				selector: 'parent-directive',
			})
			class TestParentDirective
			{

				@ChildDirective(TestChildDirective)
				@Required()
				public directive;

			}

			@Component({
				name: 'test-component',
				template: '<parent-directive></parent-directive>',
				directives: [TestChildDirective, TestParentDirective],
			})
			class TestComponent {}

			const metadata = metadataLoader.load(TestComponent);

			expect(() => {
				compiler.compile(metadata);
			}).to.throw(Error, 'TestParentDirective.directive: required @ChildDirective TestChildDirective was not found.');
		});

		it('should compile @ChildDirective', () => {
			@Directive({
				selector: 'directive',
			})
			class TestDirective {}

			@Component({
				name: 'test-component',
				template: '<directive></directive>',
				directives: [TestDirective],
			})
			class TestComponent
			{

				@ChildDirective(TestDirective)
				public directive;

			}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.childDirective'));
		});

		it('should compile @ChildDirective for directives', () => {
			@Directive({
				selector: 'child-directive',
			})
			class TestChildDirective {}

			@Directive({
				selector: 'parent-directive',
			})
			class TestParentDirective
			{

				@ChildDirective(TestChildDirective)
				public directive;

			}

			@Component({
				name: 'test-component',
				template: '<parent-directive><child-directive></child-directive></parent-directive>',
				directives: [TestChildDirective, TestParentDirective],
			})
			class TestComponent {}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.childDirective.directives'));
		});

		it('should compile @ChildDirective for component in directive', () => {
			@Component({
				name: 'child-component',
				template: '',
			})
			class TestChildComponent {}

			@Directive({
				selector: 'parent-directive',
			})
			class TestParentDirective
			{

				@ChildDirective(TestChildComponent)
				public directive;

			}

			@Component({
				name: 'test-component',
				template: '<parent-directive><child-component></child-component></parent-directive>',
				directives: [TestChildComponent, TestParentDirective],
			})
			class TestComponent {}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.childDirective.directives.component'));
		});

		it('should compile @ChildrenDirective', () => {
			@Directive({
				selector: 'directive',
			})
			class TestDirective {}

			@Component({
				name: 'test-component',
				template: '<directive></directive>',
				directives: [TestDirective],
			})
			class TestComponent
			{

				@ChildrenDirective(TestDirective)
				public directives;

			}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.childrenDirective'));
		});

		it('should compile directive with life cycle events', () => {
			@Directive({
				selector: 'directive',
			})
			class TestDirective implements OnInit, OnDestroy
			{

				public onInit(): void
				{
				}

				public onDestroy(): void
				{
				}

			}

			@Component({
				name: 'test-component',
				template: '<directive></directive>',
				directives: [TestDirective],
			})
			class TestComponent {}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.lifeCycleEvents'));
		});

		it('should throw an error when element for @HostEvent in directive does not exists', () => {
			@Directive({
				selector: 'directive',
			})
			class TestDirective
			{

				@HostEvent('click', 'button')
				public onClickButton() {}

			}

			@Component({
				name: 'test-component',
				template: '<directive></directive>',
				directives: [TestDirective],
			})
			class TestComponent {}

			let metadata = metadataLoader.load(TestComponent);

			expect(() => {
				compiler.compile(metadata);
			}).to.throw(Error, 'TestDirective.onClickButton: @HostEvent for "button" was not found.');
		});

		it('should compile @HostEvent in directive', () => {
			@Directive({
				selector: 'directive',
			})
			class TestDirective
			{

				@HostEvent('click', 'button')
				public onClickButton() {}

			}

			@Component({
				name: 'test-component',
				template: '<directive><button></button></directive>',
				directives: [TestDirective],
			})
			class TestComponent {}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.hostEvents'));
		});

		it('should include styles in template', () => {
			@Component({
				name: 'test-component',
				template: '<style>.parent-template {color: red;}</style><div class="parent-template parent-override"></div>',
				styles: [
					'.parent-override {color: green;}',
					'@media print {.parent-override {display: none;}}',
				],
			})
			class TestComponent {}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.styles'));
		});

		it('should export an element if directive is not exportable', () => {
			@Directive({
				selector: 'div',
			})
			class TestDirective {}

			@Component({
				name: 'test-component',
				template: '<div #el></div>{{ el.innerText }}',
				directives: [TestDirective],
			})
			class TestComponent {}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.export.element'));
		});

		it('should export a default directive', () => {
			@Directive({
				selector: 'div',
				exportAs: 'dir',
			})
			class TestDirective
			{


				public text = 'Hello world';

			}

			@Component({
				name: 'test-component',
				template: '<div #dir></div>{{ dir.text }}',
				directives: [TestDirective],
			})
			class TestComponent {}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.export.defaultDirective'));
		});

		it('should export specific directives and element', () => {
			@Directive({
				selector: 'div',
				exportAs: 'dirA',
			})
			class TestDirectiveA
			{


				public name = 'David';

			}

			@Directive({
				selector: 'div',
				exportAs: 'dirB',
			})
			class TestDirectiveB
			{


				public name = 'Clare';

			}

			@Component({
				name: 'test-component',
				template: '<div #el="$this" #dir-a="dirA" #dir-b="dirB"></div>{{ el.innerText }} {{ dirA.name }} {{ dirB.name }}',
				directives: [TestDirectiveA, TestDirectiveB],
			})
			class TestComponent {}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.export.specific'));
		});

		it('should export component', () => {
			@Component({
				name: 'child-component',
				exportAs: 'cmp',
				template: '',
			})
			class TestChildDirective
			{

				public text = 'Hello world';

			}

			@Component({
				name: 'test-component',
				template: '<child-component #child></child-component>{{ child.innerText }}',
				directives: [TestChildDirective],
			})
			class TestParentComponent {}

			expect(compiler.compile(metadataLoader.load(TestParentComponent))).to.be.equal(compareWith('compiler.export.component'));
		});

		it('should create new local variable inside of template', () => {
			@Component({
				name: 'test-component',
				template: '{{ let greeting = "hello world" }} {{ greeting }}',
			})
			class TestComponent {}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.localVariable'));
		});

		it('should throw an error when multiple components are used on one element', () => {
			@Component({
				name: 'test-child-component',
				template: '',
			})
			class TestChildComponentA {}

			@Component({
				name: 'test-child-component',
				template: '',
			})
			class TestChildComponentB {}

			@Component({
				name: 'test-child-component',
				template: '',
				override: TestChildComponentB,
			})
			class TestChildComponentC {}

			@Component({
				name: 'test-component',
				template: '<test-child-component></test-child-component>',
				directives: [TestChildComponentA, TestChildComponentB, TestChildComponentC],
			})
			class TestParentComponent {}

			expect(() => {
				compiler.compile(metadataLoader.load(TestParentComponent));
			}).to.throw(Error, 'More than 1 component is attached to element <test-child-component></test-child-component>: TestChildComponentA, TestChildComponentC.');
		});

		it('should initialize directive before all inner elements', () => {
			@Directive({
				selector: 'test-child-directive',
			})
			class TestChildDirective implements OnInit
			{

				public onInit(): void
				{
				}

			}

			@Component({
				name: 'test-child-component',
				template: '<span></span>',
			})
			class TestChildComponent implements OnInit
			{

				public onInit(): void
				{
				}

			}

			@Component({
				name: 'test-component',
				template:
					'<test-child-directive><div></div></test-child-directive>' +
					'<test-child-component></test-child-component>',
				directives: [TestChildDirective, TestChildComponent],
			})
			class TestParentComponent {}

			expect(compiler.compile(metadataLoader.load(TestParentComponent))).to.be.equal(compareWith('compiler.init.order'));
		});

		it('should call onTemplateInit event', () => {
			@Directive({
				selector: 'test-directive',
			})
			class TestDirective implements OnInit, OnTemplateInit
			{

				public onInit(): void
				{
				}

				public onTemplateInit(): void
				{
				}

			}

			@Component({
				name: 'test-component',
				template: '<test-directive><div></div></test-directive>',
				directives: [TestDirective],
			})
			class TestComponent implements OnTemplateInit
			{

				public onInit(): void
				{
				}

				public onTemplateInit(): void
				{
				}

			}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.templateInit'));
		});

	});

});
