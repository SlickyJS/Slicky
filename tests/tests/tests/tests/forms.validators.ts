import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component} from '@slicky/core';
import {FORM_DIRECTIVES} from '@slicky/forms';
import {ModelDirective} from '@slicky/forms/directives';
import {expect} from 'chai';


describe('#Application.forms.validators', () => {

	it('should check required validator on input[type="text"]', (done) => {
		@Component({
			name: 'test-component',
			template: '<input [(s:model)]="text" type="text" required #i="sModel">',
			directives: [FORM_DIRECTIVES],
		})
		class TestComponent
		{

			public text = '';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		model.valid.subscribe((valid) => {
			expect(valid).to.be.equal(false);

			model.errors.subscribe((errors) => {
				expect(errors).to.be.eql({required: true});
			});

			component.directive.text = 'hello world';
			component.template.refresh();

			model.valid.subscribe((valid) => {
				expect(valid).to.be.equal(true);

				model.errors.subscribe((errors) => {
					expect(errors).to.be.eql({});
				});

				done();
			});
		});
	});

	it('should check required validator on input[type="checkbox"]', (done) => {
		@Component({
			name: 'test-component',
			template: '<input [(s:model)]="checked" type="checkbox" required #i="sModel">',
			directives: [FORM_DIRECTIVES],
		})
		class TestComponent
		{

			public checked = false;

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		model.valid.subscribe((valid) => {
			expect(valid).to.be.equal(false);

			model.errors.subscribe((errors) => {
				expect(errors).to.be.eql({required: true});
			});

			component.directive.checked = true;
			component.template.refresh();

			model.valid.subscribe((valid) => {
				expect(valid).to.be.equal(true);

				model.errors.subscribe((errors) => {
					expect(errors).to.be.eql({});
				});

				done();
			});
		});
	});

	it('should check email validator on input[type="email"]', (done) => {
		@Component({
			name: 'test-component',
			template: '<input [(s:model)]="email" type="email" #i="sModel">',
			directives: [FORM_DIRECTIVES],
		})
		class TestComponent
		{

			public email = '';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		model.valid.subscribe((valid) => {
			expect(valid).to.be.equal(true);

			model.errors.subscribe((errors) => {
				expect(errors).to.be.eql({});
			});

			component.directive.email = 'test';
			component.template.refresh();

			model.valid.subscribe((valid) => {
				expect(valid).to.be.equal(false);

				model.errors.subscribe((errors) => {
					expect(errors).to.be.eql({email: true});
				});

				component.directive.email = 'test@example.com';
				component.template.refresh();

				model.valid.subscribe((valid) => {
					expect(valid).to.be.equal(true);

					model.errors.subscribe((errors) => {
						expect(errors).to.be.eql({});
					});

					done();
				});
			});
		});
	});

	it('should check minlength validator on input[type="text"]', (done) => {
		@Component({
			name: 'test-component',
			template: '<input [(s:model)]="text" type="text" minlength="2" #i="sModel">',
			directives: [FORM_DIRECTIVES],
		})
		class TestComponent
		{

			public text = '';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		model.valid.subscribe((valid) => {
			expect(valid).to.be.equal(false);

			model.errors.subscribe((errors) => {
				expect(errors).to.be.eql({minLength: {requiredLength: 2, actualLength: 0}});
			});

			component.directive.text = 'hello world';
			component.template.refresh();

			model.valid.subscribe((valid) => {
				expect(valid).to.be.equal(true);

				model.errors.subscribe((errors) => {
					expect(errors).to.be.eql({});
				});

				done();
			});
		});
	});

	it('should check maxlength validator on input[type="text"]', (done) => {
		@Component({
			name: 'test-component',
			template: '<input [(s:model)]="text" type="text" maxlength="2" #i="sModel">',
			directives: [FORM_DIRECTIVES],
		})
		class TestComponent
		{

			public text = 'hello world';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		model.valid.subscribe((valid) => {
			expect(valid).to.be.equal(false);

			model.errors.subscribe((errors) => {
				expect(errors).to.be.eql({maxLength: {requiredLength: 2, actualLength: 11}});
			});

			component.directive.text = '';
			component.template.refresh();

			model.valid.subscribe((valid) => {
				expect(valid).to.be.equal(true);

				model.errors.subscribe((errors) => {
					expect(errors).to.be.eql({});
				});

				done();
			});
		});
	});

	it('should check pattern validator on input[type="text"]', (done) => {
		@Component({
			name: 'test-component',
			template: '<input [(s:model)]="text" type="text" pattern="[a-z]+" #i="sModel">',
			directives: [FORM_DIRECTIVES],
		})
		class TestComponent
		{

			public text = '5';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		model.valid.subscribe((valid) => {
			expect(valid).to.be.equal(false);

			model.errors.subscribe((errors) => {
				expect(errors).to.be.eql({pattern: {requiredPattern: '/[a-z]+/', actualValue: '5'}});
			});

			component.directive.text = 'hello';
			component.template.refresh();

			model.valid.subscribe((valid) => {
				expect(valid).to.be.equal(true);

				model.errors.subscribe((errors) => {
					expect(errors).to.be.eql({});
				});

				done();
			});
		});
	});

	it('should check min validator on input[type="number"]', (done) => {
		@Component({
			name: 'test-component',
			template: '<input [(s:model)]="num" type="number" min="5" #i="sModel">',
			directives: [FORM_DIRECTIVES],
		})
		class TestComponent
		{

			public num = 2;

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		model.valid.subscribe((valid) => {
			expect(valid).to.be.equal(false);

			model.errors.subscribe((errors) => {
				expect(errors).to.be.eql({min: {min: 5, actual: 2}});
			});

			component.directive.num = 10;
			component.template.refresh();

			model.valid.subscribe((valid) => {
				expect(valid).to.be.equal(true);

				model.errors.subscribe((errors) => {
					expect(errors).to.be.eql({});
				});

				done();
			});
		});
	});

	it('should check max validator on input[type="number"]', (done) => {
		@Component({
			name: 'test-component',
			template: '<input [(s:model)]="num" type="number" max="5" #i="sModel">',
			directives: [FORM_DIRECTIVES],
		})
		class TestComponent
		{

			public num = 10;

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		model.valid.subscribe((valid) => {
			expect(valid).to.be.equal(false);

			model.errors.subscribe((errors) => {
				expect(errors).to.be.eql({max: {max: 5, actual: 10}});
			});

			component.directive.num = 2;
			component.template.refresh();

			model.valid.subscribe((valid) => {
				expect(valid).to.be.equal(true);

				model.errors.subscribe((errors) => {
					expect(errors).to.be.eql({});
				});

				done();
			});
		});
	});

});
