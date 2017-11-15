import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component, Filter, FilterInterface} from '@slicky/core';
import {expect} from 'chai';


describe('#Application.filters', () => {

	it('should use filter', () => {
		@Filter({
			name: 'reverse',
		})
		class TestFilter implements FilterInterface
		{

			public transform(value: string): string
			{
				return value.split('').reverse().join('');
			}

		}

		@Component({
			selector: 'test-component',
			template: '{{ "hello world" | reverse }}',
			filters: [TestFilter],
		})
		class TestComponent {}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(component.application.document.querySelector('test-component').textContent).to.be.equal('dlrow olleh');
	});

	it('should use global filters', () => {
		@Filter({
			name: 'reverse',
		})
		class TestFilter implements FilterInterface
		{

			public transform(value: string): string
			{
				return value.split('').reverse().join('');
			}

		}

		@Component({
			selector: 'test-child-component',
			template: '{{ "Clare" | reverse }}',
		})
		class TestChildComponent {}

		@Component({
			selector: 'test-parent-component',
			template: '{{ "David" | reverse }} + <test-child-component></test-child-component>',
			directives: [TestChildComponent],
		})
		class TestParentComponent {}

		const application = Tester.run('<test-parent-component></test-parent-component>', {
			directives: [TestParentComponent],
			filters: [TestFilter],
		});

		expect(application.document.body.textContent).to.be.equal('divaD + eralC');
	});

});
