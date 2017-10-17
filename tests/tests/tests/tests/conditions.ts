import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component} from '@slicky/core';
import {expect} from 'chai';


describe('#Application.conditions', () => {

	it('should render when true', () => {
		@Component({
			name: 'test-component',
			template: '<template [s:if]="visible">hello world</template>',
		})
		class TestComponent
		{

			public visible = true;

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const body = component.application.document.body;

		expect(body.textContent).to.be.equal('hello world');

		component.directive.visible = false;
		component.template.refresh();

		expect(body.textContent).to.be.equal('');

		component.directive.visible = true;
		component.template.refresh();

		expect(body.textContent).to.be.equal('hello world');
	});

	it('should render inline condition when true', () => {
		@Component({
			name: 'test-component',
			template: '<span *s:if="visible">hello world</span>',
		})
		class TestComponent
		{

			public visible = true;

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);
		const body = component.application.document.body;

		expect(body.textContent).to.be.equal('hello world');

		component.directive.visible = false;
		component.template.refresh();

		expect(body.textContent).to.be.equal('');

		component.directive.visible = true;
		component.template.refresh();

		expect(body.textContent).to.be.equal('hello world');
	});

});
