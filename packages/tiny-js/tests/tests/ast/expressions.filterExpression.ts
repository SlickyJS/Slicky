import * as _ from '../../../src';
import {expect} from 'chai';


describe('#AST/Expressions.filterExpression', () => {

	describe('render()', () => {

		it('should render filter expression without arguments', () => {
			let filter = new _.ASTFilterExpression(
				new _.ASTIdentifier('a'),
				new _.ASTIdentifier('b'),
				[]
			);

			expect(filter.render()).to.be.equal('a(b)');
		});

		it('should render filter expression with arguments', () => {
			let filter = new _.ASTFilterExpression(
				new _.ASTIdentifier('a'),
				new _.ASTIdentifier('b'),
				[
					new _.ASTIdentifier('arg1'),
					new _.ASTIdentifier('arg2'),
					new _.ASTIdentifier('arg3'),
				]
			);

			expect(filter.render()).to.be.equal('a(b, arg1, arg2, arg3)');
		});

	});

});
