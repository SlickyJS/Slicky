import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component} from '@slicky/core';
import {expect} from 'chai';


describe('#Application.templates', () => {

	it('should render template', () => {
		@Component({
			selector: 'test-component',
			template: (
				`<template id="user" inject="name">` +
					`{{ name }}` +
				`</template>` +
				`<template id="greeting" inject="user">` +
					`Hello <include selector="#user" [name]="user.name"></include>!` +
				`</template>` +
				`<include selector="#greeting" [user]="{name: 'David'}"></include> ` +
				`<include selector="#greeting" [user]="{name: 'Clare'}"></include>`
			)
		})
		class TestComponent {}

		const app = Tester.run('<test-component></test-component>', {
			directives: [TestComponent],
		});

		expect(app.document.body.textContent).to.be.equal('Hello David! Hello Clare!');
	});

});
