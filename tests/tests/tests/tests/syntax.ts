import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component} from '@slicky/core';
import {Observable} from 'rxjs';
import {expect} from 'chai';


describe('#Application.syntax', () => {

	it('should create new local variable inside of template', () => {
		@Component({
			selector: 'test-component',
			template: '{{ let greeting = "hello world" }} {{ greeting }}',
		})
		class TestComponent {}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(component.template.getParameter('greeting')).to.be.equal('hello world');
		expect(component.application.document.body.textContent.trim()).to.be.equal('hello world');
	});

	it('should dynamically refresh locally created variable', () => {
		@Component({
			selector: 'test-component',
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

	it('should call asynchronous method in template', (done) => {
		const TIMEOUT = 10;

		@Component({
			selector: 'test-component',
			template: '<div *s:if="isVisible()">hello world</div>',
		})
		class TestComponent
		{

			public visible = false;

			public isVisible(): Observable<boolean>
			{
				return new Observable<boolean>((subscriber) => {
					setTimeout(() => {
						subscriber.next(this.visible);
					}, TIMEOUT);
				});
			}

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const body = component.application.document.body;

		setTimeout(() => {
			expect(body.textContent).to.be.equal('');

			component.directive.visible = true;
			component.template.refresh();

			setTimeout(() => {
				expect(body.textContent).to.be.equal('hello world');

				component.directive.visible = false;
				component.template.refresh();

				setTimeout(() => {
					expect(body.textContent).to.be.equal('');
					done();
				}, TIMEOUT + 10);
			}, TIMEOUT + 10);
		}, TIMEOUT + 10);
	});

});
