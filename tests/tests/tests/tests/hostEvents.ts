import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component, Directive, HostEvent} from '@slicky/core';
import {callMouseEvent} from '@slicky/utils';
import {expect} from 'chai';


describe('#Application.hostEvents', () => {

	it('should add host event to self', () => {
		let clicked = 0;

		@Directive({
			selector: 'button',
		})
		class TestDirective
		{

			@HostEvent('click')
			public onClick(): void
			{
				clicked++;
			}

		}

		@Component({
			selector: 'test-component',
			template: '<button></button>',
			directives: [TestDirective],
		})
		class TestComponent {}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const document = component.application.document;
		const button = document.querySelector('button');

		expect(clicked).to.be.equal(0);

		callMouseEvent(document, button, 'click');

		expect(clicked).to.be.equal(1);

		callMouseEvent(document, button, 'click');

		expect(clicked).to.be.equal(2);
	});

});
