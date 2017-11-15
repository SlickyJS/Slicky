import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component, Directive, OnInit, OnDestroy, OnUpdate, OnAttach, Input} from '@slicky/core';
import {expect} from 'chai';


describe('#Application.lifeCycleEvents', () => {

	describe('onInit()', () => {

		it('should call onInit event and update template asynchronously', (done) => {
			@Component({
				selector: 'test-component',
				template: '{{ count }}',
			})
			class TestComponent implements OnInit
			{

				public count = 0;

				public onInit(): void
				{
					this.count++;

					setTimeout(() => {
						this.count++;
					}, 25);
				}

			}

			const component = Tester.runDirective('<test-component></test-component>', TestComponent);

			expect(component.application.document.body.textContent).to.be.equal('1');

			setTimeout(() => {
				expect(component.application.document.body.textContent).to.be.equal('2');
				done();
			}, 50);
		});

	});

	describe('onDestroy()', () => {

		it('should call onDestroy event', () => {
			let called = false;

			@Component({
				selector: 'test-component',
				template: '',
			})
			class TestComponent implements OnDestroy
			{

				public onDestroy(): void
				{
					called = true;
				}

			}

			const component = Tester.runDirective('<test-component></test-component>', TestComponent);

			expect(called).to.be.equal(false);

			component.template.destroy();

			expect(called).to.be.equal(true);
		});

	});

	describe('onUpdate()', () => {

		it('should call onUpdate event and update template', (done) => {
			const updates = [];

			@Component({
				selector: 'child-component',
				template: '{{ name }} {{ count }}',
			})
			class TestChildComponent implements OnUpdate
			{

				@Input()
				public name: string;

				public count = 0;

				public onUpdate(name: string, value: any): void
				{
					updates.push({name: name, value: value});

					setTimeout(() => {
						this.count++;
					}, 25);
				}

			}

			@Component({
				selector: 'test-component',
				template: '<child-component [name]="childName"></child-component>',
				directives: [TestChildComponent],
			})
			class TestComponent
			{

				public childName: string = 'David';

			}

			const component = Tester.runDirective('<test-component></test-component>', TestComponent);

			setTimeout(() => {
				expect(component.application.document.body.textContent).to.be.equal('David 1');
				expect(updates).to.be.eql([
					{name: 'name', value: 'David'},
				]);

				component.directive.childName = 'Clare';
				component.template.refresh();

				setTimeout(() => {
					expect(updates).to.be.eql([
						{name: 'name', value: 'David'},
						{name: 'name', value: 'Clare'},
					]);

					done();
				}, 30);
			}, 30);
		});

	});

	describe('onAttach', () => {

		it('should call onAttach event on component', () => {
			const attachedTo = {
				directiveParent: [],
				directiveChild: [],
				component: [],
			};

			@Directive({
				selector: 'test-child-directive',
			})
			class TestChildDirective implements OnAttach
			{

				public onAttach(parent): void
				{
					attachedTo.directiveChild.push(parent);
				}

			}

			@Directive({
				selector: 'test-parent-directive',
			})
			class TestParentDirective implements OnAttach
			{

				public onAttach(parent): void
				{
					attachedTo.directiveParent.push(parent);
				}

			}

			@Component({
				selector: 'test-child-component',
				template: ''
			})
			class TestChildComponent
			{

				public onAttach(parent): void
				{
					attachedTo.component.push(parent);
				}

			}

			@Component({
				selector: 'test-parent-component',
				template: (
					'<test-parent-directive>' +
						'<test-child-directive>' +
							'<test-child-component></test-child-component>' +
						'</test-child-directive>' +
					'</test-parent-directive>' +
					'<test-child-component></test-child-component>'
				),
				directives: [TestChildComponent, TestParentDirective, TestChildDirective],
			})
			class TestParentComponent {}

			Tester.runDirective('<test-parent-component></test-parent-component>', TestParentComponent);

			expect(attachedTo.directiveParent).to.have.lengthOf(1);
			expect(attachedTo.directiveParent[0]).to.be.an.instanceOf(TestParentComponent);

			expect(attachedTo.directiveChild).to.have.lengthOf(2);
			expect(attachedTo.directiveChild[0]).to.be.an.instanceOf(TestParentDirective);
			expect(attachedTo.directiveChild[1]).to.be.an.instanceOf(TestParentComponent);

			expect(attachedTo.component).to.have.lengthOf(4);
			expect(attachedTo.component[0]).to.be.an.instanceOf(TestChildDirective);
			expect(attachedTo.component[1]).to.be.an.instanceOf(TestParentDirective);
			expect(attachedTo.component[2]).to.be.an.instanceOf(TestParentComponent);
			expect(attachedTo.component[3]).to.be.an.instanceOf(TestParentComponent);
		});

	});

});
