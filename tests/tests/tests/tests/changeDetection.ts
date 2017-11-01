import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Component, OnInit, RealmRef} from '@slicky/core';
import {expect} from 'chai';


describe('#Application.changeDetection', () => {

	it('should run function outside of realm and not refresh the template', (done) => {

		@Component({
			name: 'test-component',
			template: '{{ num }}',
		})
		class TestComponent implements OnInit
		{

			public num = 0;

			private realm: RealmRef;

			constructor(realm: RealmRef)
			{
				this.realm = realm;
			}

			public onInit(): void
			{
				setTimeout(() => {
					this.num++;
				}, 5);

				this.realm.run(() => {
					setTimeout(() => {
						this.num++;
					}, 10);
				});

				this.realm.runOutside(() => {
					setTimeout(() => {
						this.num++;
					}, 15);
				});
			}

		}

		const component = Tester.runDirective('<test-component></test-component>', TestComponent);

		setTimeout(() => {
			expect(component.directive.num).to.be.equal(3);
			expect(component.application.document.body.textContent).to.be.equal('2');
			done();
		}, 50);
	});

});
