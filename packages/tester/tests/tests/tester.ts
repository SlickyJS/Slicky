import '../bootstrap';

import {Tester, ApplicationRef} from '../..';
import {Component} from '@slicky/core';
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

});
