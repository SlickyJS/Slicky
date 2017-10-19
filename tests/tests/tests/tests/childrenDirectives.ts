import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component, Directive, ChildrenDirective, ChildrenDirectivesStorage} from '@slicky/core';
import {expect} from 'chai';


describe('#Application.childrenDirectives', () => {

	it('should statically inject children directives into component', () => {
		@Directive({
			selector: 'test-directive',
		})
		class TestDirective {}

		@Component({
			name: 'test-component',
			template: '<test-directive></test-directive>',
			directives: [TestDirective],
		})
		class TestComponent
		{

			@ChildrenDirective(TestDirective)
			public children = new ChildrenDirectivesStorage;

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(component.directive.children.children).to.have.lengthOf(1);
		expect(component.directive.children.children[0]).to.be.an.instanceOf(TestDirective);
	});

	it('should dynamically inject children directives into component', () => {
		@Directive({
			selector: 'test-directive',
		})
		class TestDirective {}

		@Component({
			name: 'test-component',
			template: '<test-directive *s:for="item in items"></test-directive>',
			directives: [TestDirective],
		})
		class TestComponent
		{

			@ChildrenDirective(TestDirective)
			public children = new ChildrenDirectivesStorage;

			public items = [1, 2, 3];

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);

		expect(component.directive.children.children).to.have.lengthOf(3);

		component.directive.items = [1, 2];
		component.template.refresh();

		expect(component.directive.children.children).to.have.lengthOf(2);

		component.directive.items = [1, 2, 3];
		component.template.refresh();

		expect(component.directive.children.children).to.have.lengthOf(3);
	});

});
