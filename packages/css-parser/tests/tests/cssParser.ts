import * as css from '../../';

import {expect} from 'chai';


let parser: css.CSSParser;


describe('#CSSParser', () => {

	beforeEach(() => {
		parser = new css.CSSParser;
	});

	describe('parse()', () => {

		it('should parse simple CSS', () => {
			const ast = parser.parse('button {color: red; background-color: blue !important;}');

			expect(ast).to.be.eql([
				new css.CSSNodeSelector('button', [
					new css.CSSNodeRule('color', 'red'),
					new css.CSSNodeRule('background-color', 'blue', true),
				]),
			]);
		});

	});

});
