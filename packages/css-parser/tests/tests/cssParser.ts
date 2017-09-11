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

			expect(ast).to.be.eql([
				new css.CSSNodeRule([
					new css.CSSNodeSelector('button'),
					new css.CSSNodeSelector('a'),
				], [
					new css.CSSNodeDeclaration('color', 'red'),
					new css.CSSNodeDeclaration('background-color', 'blue', true),
				]),
			]);
		});

	});

});
