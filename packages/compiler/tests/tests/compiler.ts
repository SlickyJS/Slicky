import '../bootstrap';

import {Directive, Component, HostElement, Input, Required, Output, ChildDirective, ChildrenDirective, OnInit, OnDestroy} from '@slicky/core';
import {DirectiveMetadataLoader} from '@slicky/core/metadata';
import {ExtensionsManager} from '@slicky/core/extensions';
import {readFileSync} from 'fs';
import * as path from 'path';
import {Compiler} from '../..';

import {expect} from 'chai';


function compareWith(name: string): string
{
	return readFileSync(path.join(__dirname, '..', '_compare', `${name}.js`), {encoding: 'utf-8'});
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
				selector: 'component',
				template: '',
			})
			class TestComponent {}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.simple'));
		});

		it('should return all templates', () => {
			@Component({
				selector: 'component1',
				template: '',
			})
			class TestComponent1 {}

			@Component({
				selector: 'component2',
				template: '',
			})
			class TestComponent2 {}

			const metadata1 = metadataLoader.load(TestComponent1);
			const metadata2 = metadataLoader.load(TestComponent2);

			compiler.compile(metadata1);
			compiler.compile(metadata2);

			expect(compiler.getTemplates()).to.have.keys([
				metadata1.hash,
				metadata2.hash,
			]);
		});

		it('should return compiled template by hash', () => {
			@Component({
				selector: 'component1',
				template: '',
			})
			class TestComponent {}

			const metadata = metadataLoader.load(TestComponent);

			compiler.compile(metadata);

			expect(compiler.getTemplateByHash(metadata.hash)).to.be.a('string');
		});

		it('should compile components in @Component.precompileDirectives', () => {
			@Component({
				selector: 'precompiled-component',
				template: '',
			})
			class TestComponentPrecompiled {}

			@Component({
				selector: 'component',
				template: '',
				precompileDirectives: [TestComponentPrecompiled],
			})
			class TestComponent {}

			const metadata = metadataLoader.load(TestComponent);
			const metadataPrecompiled = metadataLoader.load(TestComponentPrecompiled);

			compiler.compile(metadata);

			expect(compiler.getTemplates()).to.have.keys([
				metadata.hash,
				metadataPrecompiled.hash,
			]);
		});

		it('should throw an error when required @HostElement is missing', () => {
			@Component({
				selector: '',
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
				selector: 'test-component',
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

		it('should compile inner component', () => {
			@Component({
				selector: 'child-component',
				template: '',
			})
			class TestComponentChild {}

			@Component({
				selector: 'parent-component',
				template: '<child-component></child-component>',
				directives: [TestComponentChild],
			})
			class TestComponentParent {}

			const metadataChild = metadataLoader.load(TestComponentChild);
			const metadataParent = metadataLoader.load(TestComponentParent);

			compiler.compile(metadataParent);

			expect(compiler.getTemplates()).to.have.keys([
				metadataChild.hash,
				metadataParent.hash,
			]);
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
				selector: '',
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
				selector: 'component-child',
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
				selector: '',
				template: [
					'<directive-child attribute-input="attr" attribute-custom="custom" attribute-watch="{{ null }}" [property-input]="true" [property-custom]="false"></directive-child>',
					'<component-child attribute-input="attr" attribute-custom="custom" attribute-watch="{{ null }}" [property-input]="true" [property-custom]="false"></component-child>',
				].join(''),
				directives: [TestDirectiveChild, TestComponentChild],
			})
			class TestComponentParent {}

			expect(compiler.compile(metadataLoader.load(TestComponentParent))).to.be.equal(compareWith('compiler.inputs'));
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
				selector: 'component-child',
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
				selector: '',
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
				selector: '',
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

		it('should throw an error when @ChildDirective is missing', () => {
			@Directive({
				selector: 'directive',
			})
			class TestDirective {}

			@Component({
				selector: '',
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

		it('should compile @ChildDirective', () => {
			@Directive({
				selector: 'directive',
			})
			class TestDirective {}

			@Component({
				selector: '',
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

		it('should compile @ChildrenDirective', () => {
			@Directive({
				selector: 'directive',
			})
			class TestDirective {}

			@Component({
				selector: '',
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
				selector: '',
				template: '<directive></directive>',
				directives: [TestDirective],
			})
			class TestComponent {}

			expect(compiler.compile(metadataLoader.load(TestComponent))).to.be.equal(compareWith('compiler.lifeCycleEvents'));
		});

	});

});
