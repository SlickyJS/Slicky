import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component, Directive, OnInit, OnDestroy, OnUpdate, Input} from '@slicky/core';
import {expect} from 'chai';


describe('#Application.lifeCycleEvents', () => {

	describe('onInit()', () => {

		it('should call onInit event and update template asynchronously', (done) => {
			@Component({
				name: 'test-component',
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
					}, 50);
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
				name: 'test-component',
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
				name: 'child-component',
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
				name: 'test-component',
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

});
