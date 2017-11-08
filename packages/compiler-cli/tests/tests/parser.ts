import {Parser, ParsedFile} from '../../compiler';
import {expect} from 'chai';
import {readFileSync} from 'fs';
import * as path from 'path';


function parse(name: string, done: (err: Error, file: ParsedFile, path: string, expected: string) => void): void
{
	const originalPath = path.resolve(`${__dirname}/../data/${name}.original.ts`);

	(new Parser(originalPath)).parse((err, file) => {
		if (err) {
			done(err, undefined, undefined, undefined);
		} else {
			done(undefined, file, originalPath, <string>readFileSync(`${__dirname}/../data/${name}.expected.ts`, {encoding: 'utf8'}));
		}
	});
}


describe('#Parser', () => {

	describe('parse()', () => {

		it('should not parse plain class', (done) => {
			parse('plain', (err, file, path, expected) => {
				expect(file).to.be.eql({
					file: path,
					source: expected,
					components: [],
				});

				done();
			});
		});

		it('should not parse file without classes', (done) => {
			parse('noClass', (err, file, path, expected) => {
				expect(file).to.be.eql({
					file: path,
					source: expected,
					components: [],
				});

				done();
			});
		});

		it('should not parse not exported directive', (done) => {
			parse('directive.noExport', (err, file, path, expected) => {
				expect(file).to.be.eql({
					file: path,
					source: expected,
					components: [],
				});

				done();
			});
		});

		it('should parse component with functional template', (done) => {
			parse('component.functionalTemplate', (err, file, path, expected) => {
				expect(file).to.be.eql({
					file: path,
					source: expected,
					components: [],
				});

				done();
			});
		});

		it('should parse component with string template', (done) => {
			parse('component.template', (err, file, path, expected) => {
				expect(file).to.be.eql({
					file: path,
					source: expected,
					components: [
						{
							name: 'TestComponent',
							template:
							'return function(template, el, component, directivesProvider) {\n\n' +
							'}',
						}
					],
				});

				done();
			});
		});

		it('should parsed mixed content', (done) => {
			parse('mixed', (err, file, path, expected) => {
				expect(file).to.be.eql({
					file: path,
					source: expected,
					components: [
						{
							name: 'TestComponentA',
							template:
							'return function(template, el, component, directivesProvider) {\n\n' +
							'}',
						}
					],
				});

				done();
			});
		});

		it('should throw an error from metadata loader', (done) => {
			parse('component.metadata.invalid', (err) => {
				expect(err).to.be.an.instanceOf(Error);
				expect(err.message).to.be.equal('Class "TestFilter" is not a valid filter.');

				done();
			});
		});

		it('should throw an error from template compiler', (done) => {
			parse('component.template.invalid', (err) => {
				expect(err).to.be.an.instanceOf(Error);
				expect(err.message).to.be.equal('Element <include> must have the "selector" attribute for specific <template>.');

				done();
			});
		});

	});

});
