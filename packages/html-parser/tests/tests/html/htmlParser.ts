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

		it('should parse two way data binding', () => {
			let ast = parse('<photo [(size)]="photoSize"></photo>');

			expect(ast).to.be.eql(
				new ASTHTMLNodeDocumentFragment([
					(() => {
						let child = new ASTHTMLNodeElement('photo');

						child.twoWayBinding.push(new ASTHTMLNodeExpressionAttribute('size', 'photoSize'));

						return child;
					})(),
				])
			);
		});

		it('should correctly parse void elements', () => {
			let ast = parse('<div><span>Hello</span><br><span>world</span></div>');

			expect(ast).to.be.eql(
				new ASTHTMLNodeDocumentFragment([
					new ASTHTMLNodeElement('div', [
						new ASTHTMLNodeElement('span', [
							new ASTHTMLNodeText('Hello'),
						]),
						new ASTHTMLNodeElement('br'),
						new ASTHTMLNodeElement('span', [
							new ASTHTMLNodeText('world'),
						]),
					]),
				])
			);
		});

		it('should parse custom elements', () => {
			let ast = parse('<my-directive></my-directive><span></span><my-child></my-child>');

			expect(ast).to.be.eql(
				new ASTHTMLNodeDocumentFragment([
					new ASTHTMLNodeElement('my-directive'),
					new ASTHTMLNodeElement('span'),
					new ASTHTMLNodeElement('my-child'),
				])
			);
		});

		it('should parse template', () => {
			let ast = parse('<template>hello world</template>');

			expect(ast).to.be.eql(
				new ASTHTMLNodeDocumentFragment([
					(() => {
						const template = new ASTHTMLNodeElement('template');

						template.content = new ASTHTMLNodeDocumentFragment([
							new ASTHTMLNodeText('hello world'),
						]);

						return template;
					})(),
				])
			);
		});

		it('should parse inline templates', () => {
			let ast = parse('<span *s:if="true" *s:for="item in items"></span>');

			expect(ast).to.be.eql(
				new ASTHTMLNodeDocumentFragment([
					(() => {
						const template = new ASTHTMLNodeElement('template');

						template.properties.push(new ASTHTMLNodeExpressionAttribute('s:if', 'true'));
						template.content = new ASTHTMLNodeDocumentFragment([
							(() => {
								const template = new ASTHTMLNodeElement('template');

								template.properties.push(new ASTHTMLNodeExpressionAttribute('s:for', 'item in items'));
								template.content = new ASTHTMLNodeDocumentFragment([
									new ASTHTMLNodeElement('span'),
								]);

								return template;
							})(),
						]);

						return template;
					})(),
				])
			);
		});

	});

});
