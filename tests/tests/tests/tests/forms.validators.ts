import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component, Directive} from '@slicky/core';
import {FormModule, AbstractValidator} from '@slicky/forms';
import {ModelDirective} from '@slicky/forms/directives';
import {expect} from 'chai';


describe('#Application.forms.validators', () => {

	it('should be valid when no validators are applied', () => {
		@Component({
			selector: 'test-component',
			template: '<input s:model type="text" #i="sModel">',
			modules: [FormModule],
		})
		class TestComponent {}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		expect(model.valid).to.be.equal(true);
		expect(model.errors).to.be.eql({});
	});

	it('should check required validator on input[type="text"]', () => {
		@Component({
			selector: 'test-component',
			template: '<input [(s:model)]="text" type="text" required #i="sModel">',
			modules: [FormModule],
		})
		class TestComponent
		{

			public text = '';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		expect(model.valid).to.be.equal(false);
		expect(model.errors).to.be.eql({required: true});

		component.directive.text = 'hello world';
		component.template.refresh();

		expect(model.valid).to.be.equal(true);
		expect(model.errors).to.be.eql({});
	});

	it('should check required validator on input[type="checkbox"]', () => {
		@Component({
			selector: 'test-component',
			template: '<input [(s:model)]="checked" type="checkbox" required #i="sModel">',
			modules: [FormModule],
		})
		class TestComponent
		{

			public checked = false;

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		expect(model.valid).to.be.equal(false);
		expect(model.errors).to.be.eql({required: true});

		component.directive.checked = true;
		component.template.refresh();

		expect(model.valid).to.be.equal(true);
		expect(model.errors).to.be.eql({});
	});

	it('should check email validator on input[type="email"]', () => {
		@Component({
			selector: 'test-component',
			template: '<input [(s:model)]="email" type="email" #i="sModel">',
			modules: [FormModule],
		})
		class TestComponent
		{

			public email = '';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		expect(model.valid).to.be.equal(true);
		expect(model.errors).to.be.eql({});

		component.directive.email = 'test';
		component.template.refresh();

		expect(model.valid).to.be.equal(false);
		expect(model.errors).to.be.eql({email: true});

		component.directive.email = 'test@example.com';
		component.template.refresh();

		expect(model.valid).to.be.equal(true);
		expect(model.errors).to.be.eql({});
	});

	it('should check minlength validator on input[type="text"]', () => {
		@Component({
			selector: 'test-component',
			template: '<input [(s:model)]="text" type="text" minlength="2" #i="sModel">',
			modules: [FormModule],
		})
		class TestComponent
		{

			public text = '';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		expect(model.valid).to.be.equal(false);
		expect(model.errors).to.be.eql({minLength: {requiredLength: 2, actualLength: 0}});

		component.directive.text = 'hello world';
		component.template.refresh();

		expect(model.valid).to.be.equal(true);
		expect(model.errors).to.be.eql({});
	});

	it('should check maxlength validator on input[type="text"]', () => {
		@Component({
			selector: 'test-component',
			template: '<input [(s:model)]="text" type="text" maxlength="2" #i="sModel">',
			modules: [FormModule],
		})
		class TestComponent
		{

			public text = 'hello world';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		expect(model.valid).to.be.equal(false);
		expect(model.errors).to.be.eql({maxLength: {requiredLength: 2, actualLength: 11}});

		component.directive.text = '';
		component.template.refresh();

		expect(model.valid).to.be.equal(true);
		expect(model.errors).to.be.eql({});
	});

	it('should check pattern validator on input[type="text"]', () => {
		@Component({
			selector: 'test-component',
			template: '<input [(s:model)]="text" type="text" pattern="[a-z]+" #i="sModel">',
			modules: [FormModule],
		})
		class TestComponent
		{

			public text = '5';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		expect(model.valid).to.be.equal(false);
		expect(model.errors).to.be.eql({pattern: {requiredPattern: '/[a-z]+/', actualValue: '5'}});

		component.directive.text = 'hello';
		component.template.refresh();

		expect(model.valid).to.be.equal(true);
		expect(model.errors).to.be.eql({});
	});

	it('should check min validator on input[type="number"]', () => {
		@Component({
			selector: 'test-component',
			template: '<input [(s:model)]="num" type="number" min="5" #i="sModel">',
			modules: [FormModule],
		})
		class TestComponent
		{

			public num = 2;

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		expect(model.valid).to.be.equal(false);
		expect(model.errors).to.be.eql({min: {min: 5, actual: 2}});

		component.directive.num = 10;
		component.template.refresh();

		expect(model.valid).to.be.equal(true);
		expect(model.errors).to.be.eql({});
	});

	it('should check max validator on input[type="number"]', () => {
		@Component({
			selector: 'test-component',
			template: '<input [(s:model)]="num" type="number" max="5" #i="sModel">',
			modules: [FormModule],
		})
		class TestComponent
		{

			public num = 10;

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		expect(model.valid).to.be.equal(false);
		expect(model.errors).to.be.eql({max: {max: 5, actual: 10}});

		component.directive.num = 2;
		component.template.refresh();

		expect(model.valid).to.be.equal(true);
		expect(model.errors).to.be.eql({});
	});

	it('should check custom async validator', (done) => {
		@Directive({
			selector: '[async-test]',
		})
		class TestAsyncValidator extends AbstractValidator<string> {

			validate(value: string, done: (errors) => void): void
			{
				setTimeout(() => {
					done(value === 'Clare' ? null : {async: true});
				}, 50);
			}

		}

		@Component({
			selector: 'test-component',
			template: '<input s:model type="text" async-test #i="sModel">',
			directives: [TestAsyncValidator],
			modules: [FormModule],
		})
		class TestComponent {}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		expect(model.valid).to.be.equal(false);
		expect(model.invalid).to.be.equal(false);
		expect(model.pending).to.be.equal(true);
		expect(model.errors).to.be.eql({});

		setTimeout(() => {
			expect(model.valid).to.be.equal(false);
			expect(model.invalid).to.be.equal(true);
			expect(model.pending).to.be.equal(false);
			expect(model.errors).to.be.eql({async: true});

			input.value = 'Clare';
			component.application.callEvent(input, 'UIEvent', 'input');

			expect(model.valid).to.be.equal(false);
			expect(model.invalid).to.be.equal(false);
			expect(model.pending).to.be.equal(true);
			expect(model.errors).to.be.eql({});

			setTimeout(() => {
				expect(model.valid).to.be.equal(true);
				expect(model.invalid).to.be.equal(false);
				expect(model.pending).to.be.equal(false);
				expect(model.errors).to.be.eql({});

				done();
			}, 70);
		}, 70);
	});

	it('should update css classes and status', (done) => {
		@Directive({
			selector: '[async-test]',
		})
		class TestAsyncValidator extends AbstractValidator<string> {

			validate(value: string, done: (errors) => void): void
			{
				setTimeout(() => {
					done(value === 'Clare' ? null : {async: true});
				}, 50);
			}

		}

		@Component({
			selector: 'test-component',
			template: '<input type="text" s:model async-test #i="sModel">',
			directives: [TestAsyncValidator],
			modules: [FormModule],
		})
		class TestComponent {}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		expect(input.className).to.be.equal('s-untouched s-pristine s-pending');
		expect(model.valid).to.be.equal(false);
		expect(model.invalid).to.be.equal(false);
		expect(model.pending).to.be.equal(true);
		expect(model.dirty).to.be.equal(false);
		expect(model.pristine).to.be.equal(true);
		expect(model.touched).to.be.equal(false);

		setTimeout(() => {
			expect(input.className).to.be.equal('s-untouched s-pristine s-invalid');
			expect(model.valid).to.be.equal(false);
			expect(model.invalid).to.be.equal(true);
			expect(model.pending).to.be.equal(false);
			expect(model.dirty).to.be.equal(false);
			expect(model.pristine).to.be.equal(true);
			expect(model.touched).to.be.equal(false);

			model.value = 'Clare';
			component.template.refresh();

			expect(input.className).to.be.equal('s-untouched s-pristine s-pending');
			expect(model.valid).to.be.equal(false);
			expect(model.invalid).to.be.equal(false);
			expect(model.pending).to.be.equal(true);
			expect(model.dirty).to.be.equal(false);
			expect(model.pristine).to.be.equal(true);
			expect(model.touched).to.be.equal(false);

			setTimeout(() => {
				expect(input.className).to.be.equal('s-untouched s-pristine s-valid');
				expect(model.valid).to.be.equal(true);
				expect(model.invalid).to.be.equal(false);
				expect(model.pending).to.be.equal(false);
				expect(model.dirty).to.be.equal(false);
				expect(model.pristine).to.be.equal(true);
				expect(model.touched).to.be.equal(false);

				input.value = 'David';
				component.application.callEvent(input, 'UIEvent', 'input');
				component.application.callEvent(input, 'FocusEvent', 'blur');

				expect(input.className).to.be.equal('s-dirty s-pending s-touched');
				expect(model.valid).to.be.equal(false);
				expect(model.invalid).to.be.equal(false);
				expect(model.pending).to.be.equal(true);
				expect(model.dirty).to.be.equal(true);
				expect(model.pristine).to.be.equal(false);
				expect(model.touched).to.be.equal(true);

				setTimeout(() => {
					expect(input.className).to.be.equal('s-dirty s-touched s-invalid');
					expect(model.valid).to.be.equal(false);
					expect(model.invalid).to.be.equal(true);
					expect(model.pending).to.be.equal(false);
					expect(model.dirty).to.be.equal(true);
					expect(model.pristine).to.be.equal(false);
					expect(model.touched).to.be.equal(true);

					done();
				}, 70);
			}, 70);
		}, 70);
	});

});
