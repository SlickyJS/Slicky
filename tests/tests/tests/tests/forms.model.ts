import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component} from '@slicky/core';
import {FORM_DIRECTIVES} from '@slicky/forms';
import {expect} from 'chai';


describe('#Application.forms.model', () => {

	it('should use model directive on textarea', () => {
		@Component({
			name: 'test-component',
			template: '<textarea [(s:model)]="text"></textarea>',
			directives: [FORM_DIRECTIVES],
		})
		class TestComponent
		{

			public text = 'lorem';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLTextAreaElement>component.application.document.querySelector('textarea');

		expect(input.value).to.be.equal('lorem');

		component.directive.text = 'ipsum';
		component.template.refresh();

		expect(input.value).to.be.equal('ipsum');

		input.value = 'lorem';
		component.application.callEvent(input, 'UIEvent', 'input');

		expect(component.directive.text).to.be.equal('lorem');
	});

	it('should use model directive on input[type="text"]', () => {
		@Component({
			name: 'test-component',
			template: '<input [(s:model)]="name" type="text">',
			directives: [FORM_DIRECTIVES],
		})
		class TestComponent
		{

			public name = 'David';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');

		expect(input.value).to.be.equal('David');

		component.directive.name = 'Clare';
		component.template.refresh();

		expect(input.value).to.be.equal('Clare');

		input.value = 'David';
		component.application.callEvent(input, 'UIEvent', 'input');

		expect(component.directive.name).to.be.equal('David');
	});

	it('should use model directive on input[type="checkbox"]', () => {
		@Component({
			name: 'test-component',
			template: '<input [(s:model)]="checked" type="checkbox">',
			directives: [FORM_DIRECTIVES],
		})
		class TestComponent
		{

			public checked = true;

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');

		expect(input.checked).to.be.equal(true);

		component.directive.checked = false;
		component.template.refresh();

		expect(input.checked).to.be.equal(false);

		input.checked = true;
		component.application.callEvent(input, 'Event', 'change');

		expect(component.directive.checked).to.be.equal(true);
	});

	it('should use model directive on input[type="number"]', () => {
		@Component({
			name: 'test-component',
			template: '<input [(s:model)]="num" type="number">',
			directives: [FORM_DIRECTIVES],
		})
		class TestComponent
		{

			public num = 5;

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');

		expect(input.value).to.be.equal('5');

		component.directive.num = 10;
		component.template.refresh();

		expect(input.value).to.be.equal('10');

		input.value = '5';
		component.application.callEvent(input, 'UIEvent', 'input');

		expect(component.directive.num).to.be.equal(5);
	});

	it('should use model directive on input[type="range"]', () => {
		@Component({
			name: 'test-component',
			template: '<input [(s:model)]="num" type="range">',
			directives: [FORM_DIRECTIVES],
		})
		class TestComponent
		{

			public num = 5;

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLInputElement>component.application.document.querySelector('input');

		expect(input.value).to.be.equal('5');

		component.directive.num = 10;
		component.template.refresh();

		expect(input.value).to.be.equal('10');

		input.value = '5';
		component.application.callEvent(input, 'UIEvent', 'input');

		expect(component.directive.num).to.be.equal(5);
	});

	it('should use model directive on select', () => {
		@Component({
			name: 'test-component',
			template: '<select [(s:model)]="letter"><option value="a"></option><option value="b"></option></select>',
			directives: [FORM_DIRECTIVES],
		})
		class TestComponent
		{

			public letter = 'b';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLSelectElement>component.application.document.querySelector('select');

		expect(input.options[input.selectedIndex].value).to.be.equal('b');

		component.directive.letter = 'a';
		component.template.refresh();

		expect(input.options[input.selectedIndex].value).to.be.equal('a');

		input.selectedIndex = 1;
		component.application.callEvent(input, 'Event', 'change');

		expect(component.directive.letter).to.be.equal('b');
	});

	it('should use model directive on select[multiple]', () => {
		@Component({
			name: 'test-component',
			template: '<select [(s:model)]="letters" multiple><option value="a"></option><option value="b"></option><option value="c"></option></select>',
			directives: [FORM_DIRECTIVES],
		})
		class TestComponent
		{

			public letters = ['a', 'c'];

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const input = <HTMLSelectElement>component.application.document.querySelector('select');

		expect(input.options[0].selected).to.be.equal(true);
		expect(input.options[1].selected).to.be.equal(false);
		expect(input.options[2].selected).to.be.equal(true);

		component.directive.letters = ['b'];
		component.template.refresh();

		expect(input.options[0].selected).to.be.equal(false);
		expect(input.options[1].selected).to.be.equal(true);
		expect(input.options[2].selected).to.be.equal(false);

		input.options[0].selected = true;
		input.options[1].selected = false;
		input.options[2].selected = true;
		component.application.callEvent(input, 'Event', 'change');

		expect(component.directive.letters).to.be.eql(['a', 'c']);
	});

	it('should use model directive on radio', () => {
		@Component({
			name: 'test-component',
			template: '<input [(s:model)]="option" name="a" value="a" type="radio"><input [(s:model)]="option" name="a" value="b" type="radio">',
			directives: [FORM_DIRECTIVES],
		})
		class TestComponent
		{

			public option = 'b';

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const inputA = <HTMLInputElement>component.application.document.querySelector('input[value="a"]');
		const inputB = <HTMLInputElement>component.application.document.querySelector('input[value="b"]');


		component.directive.option = 'a';
		component.template.refresh();

		expect(inputA.checked).to.be.equal(true);
		expect(inputB.checked).to.be.equal(false);

		inputB.checked = true;
		component.application.callEvent(inputB, 'Event', 'change');

		expect(component.directive.option).to.be.equal('b');
	});

});