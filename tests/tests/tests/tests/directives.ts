import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component, Directive, OnInit} from '@slicky/core';
import {expect} from 'chai';


describe('#Application.directives', () => {

	it('should use not render root directive inside of another root component', () => {
		let called = false;

		@Directive({
			selector: 'test-directive',
		})
		class TestDirective implements OnInit
		{

			public onInit(): void
			{
				called = true;
			}

		}

		@Component({
			name: 'test-component',
			template: '<test-directive></test-directive>',
		})
		class TestComponent {}

		Tester.run('<test-component></test-component>', {
			directives: [TestComponent, TestDirective],
		});

		expect(called).to.be.equal(false);
	});

	it('should provide child directives inside of component by another directive', () => {
		@Component({
			name: 'test-child-component',
			template: 'yes',
		})
		class TestChildComponent {}

		@Directive({
			selector: 'test-parent-directive',
			directives: [TestChildComponent],
		})
		class TestParentDirective {}

		@Component({
			name: 'test-component',
			template: (
				'<test-parent-directive>' +
					'inside: <test-child-component></test-child-component>' +
				'</test-parent-directive>, ' +
				'outside: <test-child-component></test-child-component>'
			),
			directives: [TestParentDirective],
		})
		class TestComponent {}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(component.application.document.body.textContent).to.be.equal('inside: yes, outside: ');
	})

});
