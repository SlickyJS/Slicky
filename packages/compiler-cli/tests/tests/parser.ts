import {Parser, ParsedFile} from '../../compiler';
import {expect} from 'chai';
import {readFileSync} from 'fs';
import * as path from 'path';


function parse(name: string, done: (file: ParsedFile, path: string, expected: string) => void): void
{
	const originalPath = path.resolve(`${__dirname}/../data/${name}.original.ts`);

	(new Parser(originalPath)).parse((file) => {
		done(file, originalPath, readFileSync(`${__dirname}/../data/${name}.expected.ts`, {encoding: 'utf8'}));
	});
}


describe('#Parser', () => {

	describe('parse()', () => {

		it('should not parse plain class', (done) => {
			parse('plain', (file, path, expected) => {
				expect(file).to.be.eql({
					file: path,
					source: expected,
					components: [],
				});

				done();
			});
		});

		it('should not parse file without classes', (done) => {
			parse('noClass', (file, path, expected) => {
				expect(file).to.be.eql({
					file: path,
					source: expected,
					components: [],
				});

				done();
			});
		});

		it('should not parse not exported directive', (done) => {
			parse('directive.noExport', (file, path, expected) => {
				expect(file).to.be.eql({
					file: path,
					source: expected,
					components: [],
				});

				done();
			});
		});

		it('should parse directive without id', (done) => {
			parse('directive.noId', (file, path, expected) => {
				expect(file).to.be.eql({
					file: path,
					source: expected,
					components: [],
				});

				done();
			});
		});

		it('should parse directive with id', (done) => {
			parse('directive.withId', (file, path, expected) => {
				expect(file).to.be.eql({
					file: path,
					source: expected,
					components: [],
				});

				done();
			});
		});

		it('should parse component with functional template', (done) => {
			parse('component.functionalTemplate', (file, path, expected) => {
				expect(file).to.be.eql({
					file: path,
					source: expected,
					components: [],
				});

				done();
			});
		});

		it('should parse component with string template', (done) => {
			parse('component.template', (file, path, expected) => {
				expect(file).to.be.eql({
					file: path,
					source: expected,
					components: [
						{
							id: '1107849305',
							name: 'TestComponent',
							template:
							'return function(template, el, component) {\n\n' +
							'}',
						}
					],
				});

				done();
			});
		});

		it('should parsed mixed content', (done) => {
			parse('mixed', (file, path, expected) => {
				expect(file).to.be.eql({
					file: path,
					source: expected,
					components: [
						{
							id: 'component-a',
							name: 'TestComponentA',
							template:
							'return function(template, el, component) {\n\n' +
							'}',
						}
					],
				});

				done();
			});
		});

	});

});
