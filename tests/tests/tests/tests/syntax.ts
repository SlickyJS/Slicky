import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component} from '@slicky/core';
import {expect} from 'chai';


describe('#Application.syntax', () => {

	it('should create new local variable inside of template', () => {
		@Component({
			name: 'test-component',
			template: '{{ let greeting = "hello world" }} {{ greeting }}',
		})
		class TestComponent {}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(component.template.getParameter('greeting')).to.be.equal('hello world');
		expect(component.application.document.body.textContent.trim()).to.be.equal('hello world');
	});

	it('should dynamically refresh locally created variable', () => {
		@Component({
			name: 'test-component',
			template: '{{ let localName = name }} {{ localName }}',
		})
		class TestComponent
		{

			public name = 'David';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(component.template.getParameter('localName')).to.be.equal('David');
		expect(component.application.document.body.textContent.trim()).to.be.equal('David');

		component.directive.name = 'Clare';
		component.template.refresh();

		expect(component.template.getParameter('localName')).to.be.equal('Clare');
		expect(component.application.document.body.textContent.trim()).to.be.equal('Clare');
	});

});
