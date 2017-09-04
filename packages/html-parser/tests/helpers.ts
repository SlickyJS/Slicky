import {parseHTMLFromString, ASTNodeDocumentFragment, ASTNode, ASTNodeType, ASTNodeElement} from '../';


export function parseHTML(input: string): ASTNodeDocumentFragment
{
	function clearTree(childNodes: Array<ASTNode>): void
	{
		for (let i = 0; i < childNodes.length; i++) {
			let node = childNodes[i];

			if (node.parentNode) {
				delete node.parentNode;
			}

			if (node.type === ASTNodeType.ELEMENT) {
				let element = <ASTNodeElement>node;

				clearTree(element.childNodes);

				if (element.content) {
					clearTree(element.content.childNodes);
				}
			}
		}
	}

	let ast = parseHTMLFromString(input);
	clearTree(ast.childNodes);

	return ast;
}
