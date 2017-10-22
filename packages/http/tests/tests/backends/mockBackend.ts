import {MockBackend, HTTPRequest, HTTPResponse} from '../../../';

import {expect} from 'chai';


const url = 'http://localhost:3000';

let xhr: MockBackend;


describe('#Backends/MockBackend', () => {

	beforeEach(() => {
		xhr = new MockBackend;
	});

	describe('fetch()', () => {

		it('should fetch json data via GET', (done) => {
			const request = new HTTPRequest(url, 'GET');

			xhr.receive('{"data": 1}', {'content-type': 'application/json'});

			xhr.fetch(request, (err: Error, response: HTTPResponse) => {
				expect(err).to.be.equal(null);
				expect(response.json()).to.be.eql({data: 1});
				done();
			});
		});

		it('should fetch json data via POST', (done) => {
			const request = new HTTPRequest(url, 'POST');

			xhr.receive('{"data": 2}', {'content-type': 'application/json'});

			xhr.fetch(request, (err: Error, response: HTTPResponse) => {
				expect(err).to.be.equal(null);
				expect(response.json()).to.be.eql({data: 2});
				done();
			});
		});

		it('should fetch jsonp data', (done) => {
			let request = new HTTPRequest(url, 'GET', 'callback("hello");', {
				jsonp: true,
			});

			xhr.receiveAndResend({'content-type': 'application/javascript'});

			xhr.fetch(request, (err: Error, response: HTTPResponse) => {
				expect(err).to.be.equal(null);
				expect(response.data).to.be.eql('hello');
				done();
			});
		});

		it('should fetch json data with prefix', (done) => {
			let request = new HTTPRequest(url, 'POST', 'while(1);{"number":1}', {
				jsonPrefix: 'while(1);',
			});

			xhr.receiveAndResend({'content-type': 'application/json'});

			xhr.fetch(request, (err: Error, response: HTTPResponse) => {
				expect(err).to.be.equal(null);
				expect(response.json()).to.be.eql({number: 1});
				done();
			});
		});

	});

});
