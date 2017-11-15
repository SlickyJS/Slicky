import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component, Directive, ChildDirective} from '@slicky/core';
import {expect} from 'chai';


describe('#Application.childDirectives', () => {

	it('should inject child directives into component', () => {
		@Directive({
			selector: 'test-directive',
		})
		class TestDirective {}

		@Component({
			selector: 'test-component',
			template: '<test-directive></test-directive>',
			directives: [TestDirective],
		})
		class TestComponent
		{

			@ChildDirective(TestDirective)
			public child: TestDirective;

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(component.directive.child).to.be.an.instanceOf(TestDirective);
	});

	it('should inject child directive into directive', () => {
		@Directive({
			selector: 'test-child-directive',
		})
		class TestChildDirective {}

		@Directive({
			selector: 'test-parent-directive',
		})
		class TestParentDirective
		{

			@ChildDirective(TestChildDirective)
			public child: TestChildDirective;

		}

		@Component({
			selector: 'test-component',
			template: '<test-parent-directive><test-child-directive></test-child-directive></test-parent-directive>',
			directives: [TestParentDirective, TestChildDirective],
		})
		class TestComponent
		{

			@ChildDirective(TestParentDirective)
			public child: TestParentDirective;

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(component.directive.child.child).to.be.an.instanceOf(TestChildDirective);
	});

});
