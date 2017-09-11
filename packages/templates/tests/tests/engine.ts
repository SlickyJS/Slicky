import {Engine, TemplateEncapsulation} from '../../';

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
			let template = engine.compile('hello');

			expect(template).to.be.equal(compareWith('engine.compile.text'));
		});

		it('should compile expression', () => {
			let template = engine.compile('{{ a }}');

			expect(template).to.be.equal(compareWith('engine.compile.expression'));
		});

		it('should compile simple tree', () => {
			let template = engine.compile('<div><span>Hello <i>world</i></span></div>');

			expect(template).to.be.equal(compareWith('engine.compile.simpleTree'));
		});

		it('should compile element with expression attribute', () => {
			let template = engine.compile('<div class="{{ divClass + \' red\' }} highlighted"></div>');

			expect(template).to.be.equal(compareWith('engine.compile.expressionAttribute'));
		});

		it('should throw an error when style tag is not used in the beginning of template', () => {
			expect(() => {
				engine.compile('<span></span><style></style>');
			}).to.throw(Error, 'Templates: "style" tag must be the first element in template.');
		});

		it('should not include unused styles with emulated encapsulation', () => {
			let template = engine.compile('', {
				styles: [
					'div {color: red;}',
				],
			});

			expect(template).to.be.equal(compareWith('engine.compile.styles.unused'));
		});

		it('should import styles from template with emulated encapsulation', () => {
			let template = engine.compile('<style>button, a {color: red}</style><button></button><a></a>');

			expect(template).to.be.equal(compareWith('engine.compile.styles.emulated'));
		});

		it('should compile template with native encapsulation', () => {
			let template = engine.compile('hello world', {
				encapsulation: TemplateEncapsulation.Native,
			});

			expect(template).to.be.equal(compareWith('engine.compile.encapsulation.native'));
		});

	});

});
