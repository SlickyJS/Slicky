import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component} from '@slicky/core';
import {FormModule, FormDirective} from '@slicky/forms';
import {expect} from 'chai';


describe('#Application.containers', () => {

	it('should get values from form container', () => {
		@Component({
			selector: 'test-component',
			template: '<form-container #container="sFormContainer"><input s:model name="text" value="hello world"></form-container>',
			modules: [FormModule],
		})
		class TestComponent {}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const container = <FormDirective<any>>component.template.getParameter('container');

		expect(container.values).to.be.eql({
			text: 'hello world',
		});
	});

	it('should get values from form with container', () => {
		@Component({
			selector: 'test-component',
			template:
				'<form #form="sForm">' +
					'<input s:model name="text" value="hello world">' +
					'<form-container name="inner">' +
						'<input s:model name="text" value="lorem ipsum">' +
					'</form-container>' +
				'</form>',
			modules: [FormModule],
		})
		class TestComponent {}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const form = <FormDirective<any>>component.template.getParameter('form');

		expect(form.values).to.be.eql({
			text: 'hello world',
			inner: {
				text: 'lorem ipsum',
			}
		});
	});

});
