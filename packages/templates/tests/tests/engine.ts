import {Engine} from '../../';

import {expect} from 'chai';
import {readFileSync} from 'fs';
import * as path from 'path';


function compareWith(name: string): string
{
	return readFileSync(path.join(__dirname, '..', '_compare', `${name}.js`), {encoding: 'utf-8'})
}


let engine: Engine;


describe('#Engine', () => {

	beforeEach(() => {
		engine = new Engine;
	});

	describe('compile()', () => {

		it('should compile text', () => {
			let template = engine.compile(0, 'hello');

			expect(template).to.be.equal(compareWith('engine.compile.text'));
		});

		it('should compile expression', () => {
			let template = engine.compile(0, '{{ a }}');

			expect(template).to.be.equal(compareWith('engine.compile.expression'));
		});

		it('should compile simple tree', () => {
			let template = engine.compile(0, '<div><span>Hello <i>world</i></span></div>');

			expect(template).to.be.equal(compareWith('engine.compile.simpleTree'));
		});

		it('should compile element with expression attribute', () => {
			let template = engine.compile(0, '<div class="{{ divClass + \' red\' }} highlighted"></div>');

			expect(template).to.be.equal(compareWith('engine.compile.expressionAttribute'));
		});

		it('should throw an error when style tag is not used in the beginning of template', () => {
			expect(() => {
				engine.compile(0, '<span></span><style></style>');
			}).to.throw(Error, 'Templates: "style" tag must be the first element in template.');
		});

		it('should compile template with styles', () => {
			let template = engine.compile(0, '', {
				styles: [
					'button {color: red; background-color: blue !important;}',
					'p {line-spacing: 1.6em;}',
				],
			});

			expect(template).to.be.equal(compareWith('engine.compile.styles'));
		});

		it('should import styles from template', () => {
			let template = engine.compile(0, '<style>div {color: red}</style>');

			expect(template).to.be.equal(compareWith('engine.compile.styles.template'));
		});

	});

});
