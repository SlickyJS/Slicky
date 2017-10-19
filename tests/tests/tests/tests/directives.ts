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

});
