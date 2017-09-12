import * as css from '../../';

import {expect} from 'chai';


let parser: css.CSSParser;


describe('#CSSParser', () => {

	beforeEach(() => {
		parser = new css.CSSParser;
	});

	describe('parse()', () => {

		it('should parse simple CSS', () => {
			const ast = parser.parse('button, a {color: red; background-color: blue !important;}');

			expect(ast).to.be.eql(new css.CSSNodeStylesheet([
				new css.CSSNodeRule([
					new css.CSSNodeSelector('button'),
					new css.CSSNodeSelector('a'),
				], [
					new css.CSSNodeDeclaration('color', 'red'),
					new css.CSSNodeDeclaration('background-color', 'blue', true),
				]),
			]));
		});

		it('should parse media query', () => {
			const ast = parser.parse('@media screen { a {color: red;} }');

			expect(ast).to.be.eql(new css.CSSNodeStylesheet([], [
				new css.CSSNodeMediaRule('screen', [
					new css.CSSNodeRule([
						new css.CSSNodeSelector('a'),
					], [
						new css.CSSNodeDeclaration('color', 'red'),
					]),
				]),
			]));
		});

		it('should parse selector with pseudo element', () => {
			const ast = parser.parse('a::after {color: red;}');

			expect(ast).to.be.eql(new css.CSSNodeStylesheet([
				new css.CSSNodeRule([
					new css.CSSNodeSelector('a::after'),
				], [
					new css.CSSNodeDeclaration('color', 'red'),
				]),
			]));
		});

	});

});
