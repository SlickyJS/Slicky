import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component, Directive} from '@slicky/core';
import {expect} from 'chai';


describe('#Application.exports', () => {

	it('should export element when no directive registered', () => {
		@Component({
			selector: 'test-component',
			template: '<span #span></span>',
		})
		class TestComponent {}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(component.template.getParameter('span').nodeName).to.be.equal('SPAN');
	});

	it('should export default directive', () => {
		@Directive({
			selector: 'span',
			exportAs: 'dir',
		})
		class TestDirective {}

		@Component({
			selector: 'test-component',
			template: '<span #dir></span>',
			directives: [TestDirective],
		})
		class TestComponent {}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(component.template.getParameter('dir')).to.be.an.instanceOf(TestDirective);
	});

	it('should export specific directives and element', () => {
		@Directive({
			selector: 'span',
			exportAs: 'dirA',
		})
		class TestDirectiveA {}

		@Directive({
			selector: 'span',
			exportAs: 'dirB',
		})
		class TestDirectiveB {}

		@Component({
			selector: 'test-component',
			template: '<span #el="$this" #dir-a="dirA" #dir-b="dirB"></span>',
			directives: [TestDirectiveA, TestDirectiveB],
		})
		class TestComponent {}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(component.template.getParameter('el').nodeName).to.be.equal('SPAN');
		expect(component.template.getParameter('dirA')).to.be.an.instanceOf(TestDirectiveA);
		expect(component.template.getParameter('dirB')).to.be.an.instanceOf(TestDirectiveB);
	});

});
