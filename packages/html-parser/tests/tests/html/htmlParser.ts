import {HTMLParser, ASTHTMLNodeDocumentFragment, ASTHTMLNodeTextAttribute, ASTHTMLNodeExpressionAttribute, ASTHTMLNode, ASTHTMLNodeElement, ASTHTMLNodeText, ASTHTMLNodeExpression} from '../../../html';
import {expect} from 'chai';


function parse(html: string): ASTHTMLNodeDocumentFragment
{
	function clearTree(childNodes: Array<ASTHTMLNode>): void
	{
		for (let i = 0; i < childNodes.length; i++) {
			let node = childNodes[i];

			if (node.parentNode) {
				delete node.parentNode;
			}

			if (node instanceof ASTHTMLNodeElement) {
				clearTree(node.childNodes);

				if (node.content) {
					clearTree(node.content.childNodes);
				}
			}
		}
	}

	let ast = (new HTMLParser(html)).parse();
	clearTree(ast.childNodes);

	return ast;
}


describe('#HTML/HTMLParser', () => {

	describe('parse()', () => {

		it('should parse text node', () => {
			let ast = parse('hello');

			expect(ast).to.be.eql(
				new ASTHTMLNodeDocumentFragment([
					new ASTHTMLNodeText('hello'),
				])
			);
		});

		it('should parse expression', () => {
			let ast = parse('{{ a }}');

			expect(ast).to.be.eql(
				new ASTHTMLNodeDocumentFragment([
					new ASTHTMLNodeExpression('a'),
				])
			);
		});

		it('should parse text with expression', () => {
			let ast = parse('hello {{ name }}, it is {{ time }} o\'clock');

			expect(ast).to.be.eql(
				new ASTHTMLNodeDocumentFragment([
					new ASTHTMLNodeText('hello '),
					new ASTHTMLNodeExpression('name'),
					new ASTHTMLNodeText(', it is '),
					new ASTHTMLNodeExpression('time'),
					new ASTHTMLNodeText(' o\'clock'),
				])
			);
		});

		it('should parse tree', () => {
			let ast = parse('<div><span></span><i>jou</i></div>');

			expect(ast).to.be.eql(
				new ASTHTMLNodeDocumentFragment([
					new ASTHTMLNodeElement(
						'div',
						[
							new ASTHTMLNodeElement('span'),
							new ASTHTMLNodeElement(
								'i',
								[
									new ASTHTMLNodeText('jou'),
								]
							),
						]
					),
				])
			);
		});

		it('should parse element with attributes', () => {
			let ast = parse('<div hidden id="div-id" class="{{ divClass + \' red\' }} highlighted"></div>');

			expect(ast).to.be.eql(
				new ASTHTMLNodeDocumentFragment([
					(() => {
						let child = new ASTHTMLNodeElement('div');

						child.attributes.push(new ASTHTMLNodeTextAttribute('hidden', ''));
						child.attributes.push(new ASTHTMLNodeTextAttribute('id', 'div-id'));
						child.attributes.push(new ASTHTMLNodeExpressionAttribute('class', '(divClass + \' red\') + " highlighted"'));

						return child;
					})(),
				])
			);
		});

	});

});
