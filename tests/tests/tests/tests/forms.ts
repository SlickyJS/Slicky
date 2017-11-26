import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component} from '@slicky/core';
import {FormModule, FormDirective} from '@slicky/forms';
import {expect} from 'chai';


describe('#Application.forms', () => {

	it('should throw an error when name attribute is missing on input', () => {
		@Component({
			selector: 'test-component',
			template: '<form><input s:model></form>',
			modules: [FormModule],
		})
		class TestComponent {}

		expect(() => {
			Tester.runDirective('<test-component></test-component>', TestComponent);
		}).to.throw(Error, 'FormDirective: missing "name" attribute on <input> element.');
	});

	it('should get values from form', () => {
		@Component({
			selector: 'test-component',
			template: '<form #form="sForm"><input s:model name="text" value="hello world"></form>',
			modules: [FormModule],
		})
		class TestComponent {}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const form = <FormDirective<any>>component.template.getParameter('form');

		expect(form.values).to.be.eql({
			text: 'hello world',
		});
	});

	it('should update errors in template', () => {
		@Component({
			selector: 'test-component',
			template:
				'<form #form="sForm">' +
					'<input s:model name="text" required>' +
					'<div *s:if="!form.valid">' +
						'<div *s:if="form.errors.text.required">Text is required.</div>' +
					'</div>' +
				'</form>',
			modules: [FormModule],
		})
		class TestComponent {}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const form = <FormDirective<any>>component.template.getParameter('form');
		const body = component.application.document.body;

		expect(form.valid).to.be.equal(false);
		expect(form.errors).to.be.eql({text: {required: true}});
		expect(body.textContent).to.be.equal('Text is required.');

		form.get('text').value = 'hello world';
		component.template.refresh();

		expect(form.valid).to.be.equal(true);
		expect(form.errors).to.be.eql({text: {}});
		expect(body.textContent).to.be.equal('');
	});

	it('should submit form with s:submit directive', () => {
		const submitted: Array<any> = [];

		@Component({
			selector: 'test-component',
			template:
			'<form (s:submit)="submit($event)">' +
				'<input s:model name="text" required>' +
			'</form>',
			modules: [FormModule],
		})
		class TestComponent
		{

			public submit(form: FormDirective<any>): void
			{
				expect(form).to.be.an.instanceOf(FormDirective);
				submitted.push({
					valid: form.valid,
					errors: form.errors,
					values: form.values,
				});
			}

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const form = <HTMLFormElement>component.application.document.querySelector('form');
		const input = <HTMLInputElement>component.application.document.querySelector('input');

		component.application.callEvent(form, 'Event', 'submit');

		expect(submitted).to.be.eql([]);

		input.value = 'hello world';
		component.application.callEvent(input, 'UIEvent', 'input');
		component.application.callEvent(form, 'Event', 'submit');

		expect(submitted).to.be.eql([
			{
				valid: true,
				errors: {
					text: {},
				},
				values: {
					text: 'hello world',
				},
			},
		]);
	});

});
