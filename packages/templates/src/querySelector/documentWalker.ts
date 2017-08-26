import {find, exists} from '@slicky/utils';
import {IDocumentWalker} from '@slicky/query-selector';
import * as _ from '@slicky/html-parser';


export class DocumentWalker implements IDocumentWalker
{


	public getNodeName(node: _.ASTHTMLNodeElement): string
	{
		return node.name;
	}


	public isElement(node: _.ASTHTMLNode): boolean
	{
		return node instanceof _.ASTHTMLNodeElement;
	}


	public isString(node: _.ASTHTMLNode): boolean
	{
		return node instanceof _.ASTHTMLNodeText;
	}


	public getParentNode(node: _.ASTHTMLNodeElement): _.ASTHTMLNodeParent
	{
		return node.parentNode;
	}


	public getChildNodes(parent: _.ASTHTMLNodeParent): Array<_.ASTHTMLNode>
	{
		return parent.childNodes;
	}


	public getAttribute(node: _.ASTHTMLNodeElement, name: string): string
	{
		let attr = find(node.attributes, (attribute: _.ASTHTMLNodeAttribute) => attribute.name === name);

		return exists(attr) ? attr.value : undefined;
	}

}
