import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component} from '@slicky/core';
import {expect} from 'chai';


describe('#Application.simple', () => {

	it('should render text', () => {
		@Component({
			selector: 'test-component',
			template: 'hello world',
		})
		class TestComponent {}

		const app = Tester.run('<test-component></test-component>', {
			directives: [TestComponent],
		});

		expect(app.document.body.textContent).to.be.equal('hello world');
	});

	it('should render expression', () => {
		@Component({
			selector: 'test-component',
			template: '{{ "hello world" }}',
		})
		class TestComponent {}

		const app = Tester.run('<test-component></test-component>', {
			directives: [TestComponent],
		});

		expect(app.document.body.textContent).to.be.equal('hello world');
	});

});
