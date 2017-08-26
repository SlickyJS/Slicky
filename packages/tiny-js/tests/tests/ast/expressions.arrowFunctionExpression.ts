import * as _ from '../../../src';
import {expect} from 'chai';


describe('#AST/Expressions.arrowFunctionExpression', () => {

	describe('render()', () => {

		it('should render arrow function with expression', () => {
			let arrowFunction = new _.ASTArrowFunctionExpression(
				[],
				new _.ASTReturnStatement(
					new _.ASTIdentifier('a')
				)
			);

			expect(arrowFunction.render()).to.be.equal('function() {return a}');
		});

		it('should render arrow function with body', () => {
			let arrowFunction = new _.ASTArrowFunctionExpression(
				[],
				[
					new _.ASTIdentifier('a'),
				]
			);

			expect(arrowFunction.render()).to.be.equal('function() {a}');
		});

		it('should render arrow function with arguments', () => {
			let arrowFunction = new _.ASTArrowFunctionExpression(
				[
					new _.ASTIdentifier('arg1'),
					new _.ASTIdentifier('arg2'),
					new _.ASTIdentifier('arg3'),
				],
				[]
			);

			expect(arrowFunction.render()).to.be.equal('function(arg1, arg2, arg3) {}');
		});

	});

});
