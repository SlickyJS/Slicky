import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component} from '@slicky/core';
import {expect} from 'chai';


describe('#Application.loops', () => {

	it('should render loop', () => {
		@Component({
			selector: 'test-component',
			template: '<template [s:for]="letter in letters">{{ letter }}</template>',
		})
		class TestComponent
		{

			public letters = ['a', 'b', 'c'];

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const body = component.application.document.body;

		expect(body.textContent).to.be.equal('abc');

		component.directive.letters = ['a', 'b'];
		component.template.refresh();

		expect(body.textContent).to.be.equal('ab');

		component.directive.letters = ['a', 'b', 'c', 'd'];
		component.template.refresh();

		expect(body.textContent).to.be.equal('abcd');
	});

});
