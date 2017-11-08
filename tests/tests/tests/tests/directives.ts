import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component, Directive, OnInit, DirectivesStorageRef, ChangeDetectorRef, ElementRef, RealmRef} from '@slicky/core';
import {RootDirectiveRunner, RootDirectiveRef} from '@slicky/application/runtime';
import {DirectiveMetadataLoader} from '@slicky/core/metadata';
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

	it('should provide directives for component from array', () => {
		const initialized = [];

		@Directive({
			selector: '[test-directive-a]',
		})
		class TestDirectiveA implements OnInit
		{

			public onInit(): void
			{
				initialized.push('a');
			}

		}

		@Directive({
			selector: '[test-directive-b]',
		})
		class TestDirectiveB implements OnInit
		{

			public onInit(): void
			{
				initialized.push('b');
			}

		}

		@Component({
			name: 'test-component',
			template: '<div test-directive-a test-directive-b></div>',
			directives: [[TestDirectiveA, TestDirectiveB]],
		})
		class TestComponent {}

		Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(initialized).to.be.eql(['a', 'b']);
	});

	it('should override default directive with more specific directive', () => {
		const directives = [];

		@Directive({
			selector: 'test-directive',
		})
		class TestDirective
		{

			public onInit(): void
			{
				directives.push('test-directive');
			}

		}

		@Directive({
			selector: 'test-directive',
		})
		class TestDefaultDirective
		{

			public onInit(): void
			{
				directives.push('test-default-directive');
			}

		}

		@Directive({
			selector: 'test-directive',
			override: TestDefaultDirective,
		})
		class TestSpecificDirective
		{

			public onInit(): void
			{
				directives.push('test-specific-directive');
			}

		}

		@Directive({
			selector: 'test-directive',
			override: TestSpecificDirective,
		})
		class TestMoreSpecificDirective
		{

			public onInit(): void
			{
				directives.push('test-more-specific-directive');
			}

		}

		@Component({
			name: 'test-component',
			template: '<test-directive></test-directive>',
			directives: [TestMoreSpecificDirective, TestDirective, TestDefaultDirective, TestSpecificDirective],
		})
		class TestComponent {}

		Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(directives).to.be.eql(['test-more-specific-directive', 'test-directive']);
	});

	it('should override only matching directive by another directive', () => {
		const directives = [];

		@Directive({
			selector: '[dir-a]',
		})
		class TestCorrectDirective implements OnInit
		{

			public onInit(): void
			{
				directives.push('a');
			}

		}

		@Directive({
			selector: '[dir-b]',
			override: TestCorrectDirective,
		})
		class TestWrongDirective implements OnInit
		{

			public onInit(): void
			{
				directives.push('b');
			}

		}

		@Component({
			name: 'test-component',
			template: '<div dir-a></div>',
			directives: [TestCorrectDirective, TestWrongDirective],
		})
		class TestComponent {}

		Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(directives).to.be.eql(['a']);
	});

	it('should autowire ChangeDetectorRef into inner directive', () => {
		let directiveChangeDetector = null;

		@Directive({
			selector: 'test-directive',
		})
		class TestDirective
		{

			constructor(changeDetector: ChangeDetectorRef)
			{
				directiveChangeDetector = changeDetector;
			}

		}

		@Component({
			name: 'test-component',
			template: '<test-directive></test-directive>',
			directives: [TestDirective],
		})
		class TestComponent {}

		Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(directiveChangeDetector).to.be.an.instanceOf(ChangeDetectorRef);
	});

	it('should autowire ChangeDetectorRef into inner directive in root component', () => {
		let directiveChangeDetector = null;

		@Directive({
			selector: 'test-directive',
		})
		class TestDirective
		{

			constructor(changeDetector: ChangeDetectorRef)
			{
				directiveChangeDetector = changeDetector;
			}

		}

		@Component({
			name: 'test-component',
			template: '<test-directive></test-directive>',
			directives: [TestDirective],
		})
		class TestComponent {}

		Tester.runRootDirective('<test-component></test-component>', TestComponent);

		expect(directiveChangeDetector).to.be.an.instanceOf(ChangeDetectorRef);
	});

	it('should add dynamically new root directive', () => {
		@Directive({
			selector: 'test-child-directive',
		})
		class TestChildDirective {}

		let directive: RootDirectiveRef<TestChildDirective> = null;

		@Directive({
			selector: 'test-parent-directive',
		})
		class TestParentDirective implements OnInit
		{

			private runner: RootDirectiveRunner;

			private metadata: DirectiveMetadataLoader;

			private el: ElementRef<HTMLElement>;

			constructor(runner: RootDirectiveRunner, metadata: DirectiveMetadataLoader, el: ElementRef<HTMLElement>)
			{
				this.runner = runner;
				this.metadata = metadata;
				this.el = el;
			}

			public onInit(): void
			{
				const metadata = this.metadata.loadDirective(TestChildDirective);
				const el = this.el.nativeElement.ownerDocument.querySelector('test-child-directive');

				directive = this.runner.runDirective(TestChildDirective, metadata, el);
			}

		}

		Tester.run('<test-parent-directive></test-parent-directive><test-child-directive></test-child-directive>', {
			directives: [TestParentDirective],
		});

		expect(directive).to.be.an.instanceOf(RootDirectiveRef);
		expect(directive.getDirective()).to.be.an.instanceOf(TestChildDirective);
	});

	it('should call onInit on root components only once', () => {
		let called = 0;

		@Component({
			name: 'test-component',
			template: '',
		})
		class TestComponent implements OnInit
		{

			public onInit(): void
			{
				called++;
			}

		}

		Tester.runRootDirective('<test-component></test-component>', TestComponent);

		expect(called).to.be.equal(1);
	});

	it('should inject RealmRef into root component', () => {
		let realm: RealmRef = null;

		@Component({
			name: 'test-component',
			template: '',
		})
		class TestComponent
		{

			constructor(r: RealmRef)
			{
				realm = r;
			}

		}

		Tester.runRootDirective('<test-component></test-component>', TestComponent);

		expect(realm).to.be.an.instanceOf(RealmRef);
	});

	it('should inject RealmRef into non-root component', () => {
		let realm: RealmRef = null;

		@Component({
			name: 'test-component',
			template: '',
		})
		class TestComponent
		{

			constructor(r: RealmRef)
			{
				realm = r;
			}

		}

		Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(realm).to.be.an.instanceOf(RealmRef);
	});

});
