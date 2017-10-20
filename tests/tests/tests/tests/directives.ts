import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component, Directive, OnInit, DirectivesStorageRef} from '@slicky/core';
import {forEach} from '@slicky/utils';
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
	});

	it('should have access to DirectivesStorage inside of directive', () => {
		const directives = {
			a: [],
			b: [],
			c: [],
		};

		interface TestDirective
		{

			name: string;

		}

		@Directive({
			selector: '[test-directive-a]',
		})
		class TestDirectiveA implements OnInit, TestDirective
		{

			public name = 'a';

			public storage: DirectivesStorageRef;

			constructor(storage: DirectivesStorageRef)
			{
				this.storage = storage;
			}

			public onInit(): void
			{
				forEach(this.storage.directives, (directive: TestDirective) => directives.a.push(directive.name));
			}

		}

		@Directive({
			selector: '[test-directive-b]',
		})
		class TestDirectiveB implements OnInit, TestDirective
		{

			public name = 'b';

			public storage: DirectivesStorageRef;

			constructor(storage: DirectivesStorageRef)
			{
				this.storage = storage;
			}

			public onInit(): void
			{
				forEach(this.storage.directives, (directive: TestDirective) => directives.b.push(directive.name));
			}

		}

		@Directive({
			selector: '[test-directive-c]',
		})
		class TestDirectiveC implements OnInit, TestDirective
		{

			public name = 'c';

			public storage: DirectivesStorageRef;

			constructor(storage: DirectivesStorageRef)
			{
				this.storage = storage;
			}

			public onInit(): void
			{
				forEach(this.storage.directives, (directive: TestDirective) => directives.c.push(directive.name));
			}

		}

		@Component({
			name: 'test-component',
			template: '<div test-directive-a test-directive-b test-directive-c></div>',
			directives: [TestDirectiveA, TestDirectiveB, TestDirectiveC],
		})
		class TestComponent {}

		Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(directives).to.be.eql({
			a: ['a', 'b', 'c'],
			b: ['a', 'b', 'c'],
			c: ['a', 'b', 'c'],
		});
	});

});