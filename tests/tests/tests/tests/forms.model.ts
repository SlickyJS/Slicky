import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component} from '@slicky/core';
import {FormModule} from '@slicky/forms';
import {ModelDirective} from '@slicky/forms/directives';
import {expect} from 'chai';


describe('#Application.forms.model', () => {

	it('should throw an error when value accessor is missing on s:model', () => {
		@Component({
			selector: 'test-component',
			template: '<div s:model></div>',
			modules: [FormModule],
		})
		class TestComponent {}

		expect(() => {
			Tester.runDirective('<test-component></test-component>', TestComponent);
		}).to.throw(Error, 'AbstractInputControl: missing form value accessor on <div> element.');
	});

	it('should use model directive on textarea', () => {
		@Component({
			selector: 'test-component',
			template: '<textarea [(s:model)]="text" #i="sModel"></textarea>',
			modules: [FormModule],
		})
		class TestComponent
		{

			public text = 'lorem';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLTextAreaElement>component.application.document.querySelector('textarea');
		const model = <ModelDirective<string, HTMLTextAreaElement>>component.template.getParameter('i');

		expect(input.value).to.be.equal('lorem');
		expect(model.value).to.be.equal('lorem');

		component.directive.text = 'ipsum';
		component.template.refresh();

		expect(input.value).to.be.equal('ipsum');
		expect(model.value).to.be.equal('ipsum');

		input.value = 'lorem';
		component.application.callEvent(input, 'UIEvent', 'input');

		expect(component.directive.text).to.be.equal('lorem');
		expect(model.value).to.be.equal('lorem');
	});

	it('should use model directive on input[type="text"]', () => {
		@Component({
			selector: 'test-component',
			template: '<input [(s:model)]="name" type="text" #i="sModel">',
			modules: [FormModule],
		})
		class TestComponent
		{

			public name = 'David';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		expect(input.value).to.be.equal('David');
		expect(model.value).to.be.equal('David');

		component.directive.name = 'Clare';
		component.template.refresh();

		expect(input.value).to.be.equal('Clare');
		expect(model.value).to.be.equal('Clare');

		input.value = 'David';
		component.application.callEvent(input, 'UIEvent', 'input');

		expect(component.directive.name).to.be.equal('David');
		expect(model.value).to.be.equal('David');
	});

	it('should use model directive on input[type="checkbox"]', () => {
		@Component({
			selector: 'test-component',
			template: '<input [(s:model)]="checked" type="checkbox" #i="sModel">',
			modules: [FormModule],
		})
		class TestComponent
		{

			public checked = true;

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<boolean, HTMLTextAreaElement>>component.template.getParameter('i');

		expect(input.checked).to.be.equal(true);
		expect(model.value).to.be.equal(true);

		component.directive.checked = false;
		component.template.refresh();

		expect(input.checked).to.be.equal(false);
		expect(model.value).to.be.equal(false);

		input.checked = true;
		component.application.callEvent(input, 'Event', 'change');

		expect(component.directive.checked).to.be.equal(true);
		expect(model.value).to.be.equal(true);
	});

	it('should use model directive on input[type="number"]', () => {
		@Component({
			selector: 'test-component',
			template: '<input [(s:model)]="num" type="number" #i="sModel">',
			modules: [FormModule],
		})
		class TestComponent
		{

			public num = 5;

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<number, HTMLTextAreaElement>>component.template.getParameter('i');

		expect(input.value).to.be.equal('5');
		expect(model.value).to.be.equal(5);

		component.directive.num = 10;
		component.template.refresh();

		expect(input.value).to.be.equal('10');
		expect(model.value).to.be.equal(10);

		input.value = '5';
		component.application.callEvent(input, 'UIEvent', 'input');

		expect(component.directive.num).to.be.equal(5);
		expect(model.value).to.be.equal(5);
	});

	it('should use model directive on input[type="range"]', () => {
		@Component({
			selector: 'test-component',
			template: '<input [(s:model)]="num" type="range" #i="sModel">',
			modules: [FormModule],
		})
		class TestComponent
		{

			public num = 5;

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<number, HTMLTextAreaElement>>component.template.getParameter('i');

		expect(input.value).to.be.equal('5');
		expect(model.value).to.be.equal(5);

		component.directive.num = 10;
		component.template.refresh();

		expect(input.value).to.be.equal('10');
		expect(model.value).to.be.equal(10);

		input.value = '5';
		component.application.callEvent(input, 'UIEvent', 'input');

		expect(component.directive.num).to.be.equal(5);
		expect(model.value).to.be.equal(5);
	});

	it('should use model directive on select', () => {
		@Component({
			selector: 'test-component',
			template: '<select [(s:model)]="letter" #i="sModel"><option value="a"></option><option value="b"></option></select>',
			modules: [FormModule],
		})
		class TestComponent
		{

			public letter = 'b';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLSelectElement>component.application.document.querySelector('select');
		const model = <ModelDirective<string, HTMLSelectElement>>component.template.getParameter('i');

		expect(input.options[input.selectedIndex].value).to.be.equal('b');
		expect(model.value).to.be.equal('b');

		component.directive.letter = 'a';
		component.template.refresh();

		expect(input.options[input.selectedIndex].value).to.be.equal('a');
		expect(model.value).to.be.equal('a');

		input.selectedIndex = 1;
		component.application.callEvent(input, 'Event', 'change');

		expect(component.directive.letter).to.be.equal('b');
		expect(model.value).to.be.equal('b');
	});

	it('should use model directive on select[multiple]', () => {
		@Component({
			selector: 'test-component',
			template: '<select [(s:model)]="letters" multiple #i="sModel"><option value="a"></option><option value="b"></option><option value="c"></option></select>',
			modules: [FormModule],
		})
		class TestComponent
		{

			public letters = ['a', 'c'];

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLSelectElement>component.application.document.querySelector('select');
		const model = <ModelDirective<string, HTMLSelectElement>>component.template.getParameter('i');

		expect(input.options[0].selected).to.be.equal(true);
		expect(input.options[1].selected).to.be.equal(false);
		expect(input.options[2].selected).to.be.equal(true);
		expect(model.value).to.be.eql(['a', 'c']);

		component.directive.letters = ['b'];
		component.template.refresh();

		expect(input.options[0].selected).to.be.equal(false);
		expect(input.options[1].selected).to.be.equal(true);
		expect(input.options[2].selected).to.be.equal(false);
		expect(model.value).to.be.eql(['b']);

		input.options[0].selected = true;
		input.options[1].selected = false;
		input.options[2].selected = true;
		component.application.callEvent(input, 'Event', 'change');

		expect(component.directive.letters).to.be.eql(['a', 'c']);
		expect(model.value).to.be.eql(['a', 'c']);
	});

	it('should use model directive on radio', (done) => {
		@Component({
			selector: 'test-component',
			template: '<input [(s:model)]="option" name="a" value="a" type="radio" #i-a="sModel"><input [(s:model)]="option" name="a" value="b" type="radio" #i-b="sModel">',
			modules: [FormModule],
		})
		class TestComponent
		{

			public option = 'b';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const inputA = <HTMLInputElement>component.application.document.querySelector('input[value="a"]');
		const inputB = <HTMLInputElement>component.application.document.querySelector('input[value="b"]');
		const modelA = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('iA');
		const modelB = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('iB');

		component.directive.option = 'a';
		component.template.refresh();

		expect(inputA.checked).to.be.equal(true);
		expect(inputB.checked).to.be.equal(false);
		expect(modelA.value).to.be.equal('a');
		expect(modelB.value).to.be.equal('a');

		inputB.checked = true;
		component.application.callEvent(inputB, 'Event', 'change');

		setTimeout(() => {
			expect(component.directive.option).to.be.equal('b');
			expect(modelA.value).to.be.equal('b');
			expect(modelB.value).to.be.equal('b');

			done();
		}, 10);
	});

	it('should use model without connection to directive', () => {
		@Component({
			selector: 'test-component',
			template: '<input type="text" s:model #i="sModel" value="hello world">',
			modules: [FormModule],
		})
		class TestComponent {}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');
		const model = <ModelDirective<string, HTMLInputElement>>component.template.getParameter('i');

		expect(input.value).to.be.equal('hello world');
		expect(model.value).to.be.equal('hello world');

		input.value = 'lorem ipsum';
		component.application.callEvent(input, 'UIEvent', 'input');

		expect(input.value).to.be.equal('lorem ipsum');
		expect(model.value).to.be.equal('lorem ipsum');
	});

});
