import '../bootstrap';

import {Tester, ApplicationRef, DirectiveRef} from '../..';
import {Directive, Component} from '@slicky/core';
import {ComponentTemplate} from '@slicky/application/runtime';
import {expect} from 'chai';


describe('#Tester', () => {

	describe('run()', () => {

		it('should run testing application', () => {
			@Component({
				name: 'test-component',
				template: '{{ message }}',
			})
			class TestComponent
			{

				public message = 'Hello world';

			}

			const app = Tester.run('<test-component></test-component>', {
				directives: [TestComponent],
			});

			expect(app).to.be.an.instanceOf(ApplicationRef);
			expect(app.document.body.textContent).to.be.equal('Hello world');
		});

	});

	describe('runRootDirective()', () => {

		it('should throw an error if more than one element given', () => {
			@Directive({
				selector: 'span',
			})
			class TestDirective {}

			expect(() => {
				Tester.runRootDirective('<span></span><span></span>', TestDirective);
			}).to.throw(Error, 'Tester.runRootDirective: el should be only one element definition, "<span></span><span></span>" given.');
		});

		it('should run root directive', () => {
			@Directive({
				selector: 'span',
			})
			class TestDirective {}

			const directive = Tester.runRootDirective('<span></span>', TestDirective);

			expect(directive).to.be.an.instanceOf(DirectiveRef);
			expect(directive.directive).to.be.an.instanceOf(TestDirective);
			expect(directive.template).to.be.equal(undefined);
		});

	});

	describe('runDirective()', () => {

		it('should run directive', () => {
			@Directive({
				selector: 'span',
			})
			class TestDirective {}

			const directive = Tester.runDirective('<span></span>', TestDirective);

			expect(directive).to.be.an.instanceOf(DirectiveRef);
			expect(directive.directive).to.be.an.instanceOf(TestDirective);
			expect(directive.template).to.be.equal(undefined);
		});

		it('should run component', () => {
			@Component({
				name: 'test-component',
				template: '',
			})
			class TestComponent {}

			const component = Tester.runDirective('<test-component></test-component>', TestComponent);

			expect(component).to.be.an.instanceOf(DirectiveRef);
			expect(component.directive).to.be.an.instanceOf(TestComponent);
			expect(component.template).to.be.an.instanceOf(ComponentTemplate);
		});

	});

});
