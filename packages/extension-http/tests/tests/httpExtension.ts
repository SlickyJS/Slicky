import '../bootstrap';

import {Tester} from '@slicky/tester';
import {Http} from '@slicky/http';
import {Directive} from '@slicky/core';
import {HTTPExtension} from '../../';

import {expect} from 'chai';


describe('#HTTPExtension', () => {

	it('should register http extension', () => {
		let httpService: Http;

		@Directive({
			selector: 'test-directive',
		})
		class TestDirective
		{

			constructor(http: Http)
			{
				httpService = http;
			}

		}

		Tester.run('<test-directive>', {
			directives: [TestDirective],
		}, (app) => {
			app.addExtension(new HTTPExtension);
		});

		expect(httpService).to.be.an.instanceOf(Http);
	});

});
