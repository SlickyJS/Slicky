import {AST as _} from 'parse5';
import {forEach, exists} from '@slicky/utils';


export abstract class ASTHTMLNode
{


	public parentNode: ASTHTMLNodeParent;

}


export abstract class ASTHTMLNodeBaseText extends ASTHTMLNode
{


	public value: string;


	constructor(value: string)
	{
		super();

		this.value = value;
	}

}


export class ASTHTMLNodeText extends ASTHTMLNodeBaseText
{
}


export class ASTHTMLNodeExpression extends ASTHTMLNodeBaseText
{
}


export abstract class ASTHTMLNodeParent extends ASTHTMLNode
{


	public childNodes: Array<ASTHTMLNode>;


	constructor(childNodes: Array<ASTHTMLNode> = [])
	{
		super();

		this.childNodes = childNodes;
	}

}


export class ASTHTMLNodeDocument extends ASTHTMLNodeParent
{
}


export class ASTHTMLNodeDocumentFragment extends ASTHTMLNodeParent
{
}


export abstract class ASTHTMLNodeAttribute
{


	public name: string;

	public value: string;


	constructor(name: string, value: string)
	{
		this.name = name;
		this.value = value;
	}

}


export class ASTHTMLNodeTextAttribute extends ASTHTMLNodeAttribute
{
}


export class ASTHTMLNodeExpressionAttribute extends ASTHTMLNodeAttribute
{
}


export class ASTHTMLNodeExpressionAttributeEvent extends ASTHTMLNodeExpressionAttribute
{


	public preventDefault: boolean = false;

}


export class ASTHTMLNodeComment extends ASTHTMLNode
{


	public value: string;


	constructor(value: string)
	{
		super();

		this.value = value;
	}

}


export class ASTHTMLNodeElement extends ASTHTMLNodeParent
{


	public name: string;

	public attributes: Array<ASTHTMLNodeAttribute> = [];

	public events: Array<ASTHTMLNodeExpressionAttributeEvent> = [];

	public properties: Array<ASTHTMLNodeExpressionAttribute> = [];

	public twoWayBinding: Array<ASTHTMLNodeExpressionAttribute> = [];

	public exports: Array<ASTHTMLNodeAttribute> = [];

	public templates: Array<ASTHTMLNodeExpressionAttribute> = [];

	public content: ASTHTMLNodeDocumentFragment;


	constructor(name: string, childNodes: Array<ASTHTMLNode> = [])
	{
		super(childNodes);

		this.name = name;
	}

}


export class AST implements _.TreeAdapter
{


	public createDocument(): ASTHTMLNodeDocument
	{
		return new ASTHTMLNodeDocument;
	}


	public createDocumentFragment(): ASTHTMLNodeDocumentFragment
	{
		return new ASTHTMLNodeDocumentFragment;
	}


	public setDocumentType(document: ASTHTMLNodeDocument, name: string, publicId: string, systemId: string): void
	{
	}


	public setDocumentMode(document: ASTHTMLNodeDocument, mode: _.DocumentMode): void
	{
	}


	public createElement(tagName: string, namespaceURI: string, attrs: Array<_.Default.Attribute>): ASTHTMLNodeElement
	{
		let element = new ASTHTMLNodeElement(tagName);
		this.processAttributes(element, attrs);

		return element;
	}


	public appendChild(parentNode: ASTHTMLNodeParent, newNode: ASTHTMLNode): void
	{
		parentNode.childNodes.push(newNode);
		newNode.parentNode = parentNode;
	}


	public insertBefore(parentNode: ASTHTMLNodeParent, newNode: ASTHTMLNode, referenceNode: ASTHTMLNode): void
	{
		let pos = parentNode.childNodes.indexOf(referenceNode);

		parentNode.childNodes.splice(pos, 0, newNode);
		newNode.parentNode = parentNode;
	}


	public setTemplateContent(templateElement: ASTHTMLNodeElement, contentElement: ASTHTMLNodeDocumentFragment): void
	{
		templateElement.content = contentElement;
	}


	public getTemplateContent(templateElement: ASTHTMLNodeElement): ASTHTMLNodeDocumentFragment
	{
		return templateElement.content;
	}


	public detachNode(node: ASTHTMLNode): void
	{
		if (node.parentNode) {
			let pos = node.parentNode.childNodes.indexOf(node);

			node.parentNode.childNodes.splice(pos, 1);
			node.parentNode = null;
		}
	}


	public insertText(parentNode: ASTHTMLNodeParent, text: string): void
	{
		if (parentNode.childNodes.length) {
			let prevNode = parentNode.childNodes[parentNode.childNodes.length - 1];

			if (prevNode instanceof ASTHTMLNodeText) {
				prevNode.value += text;
				return;
			}
		}

		this.appendChild(parentNode, this.createTextNode(text));
	}


	public insertTextBefore(parentNode: ASTHTMLNodeParent, text: string, referenceNode: ASTHTMLNode): void
	{
		let prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];

		if (prevNode && prevNode instanceof ASTHTMLNodeText) {
			prevNode.value += text;
		} else {
			this.insertBefore(parentNode, this.createTextNode(text), referenceNode);
		}
	}


	public insertExpressionBefore(parentNode: ASTHTMLNodeParent, expression: string, referenceNode: ASTHTMLNode): void
	{
		let prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];

		if (prevNode && prevNode instanceof ASTHTMLNodeExpression) {
			prevNode.value += expression;
		} else {
			this.insertBefore(parentNode, this.createExpressionNode(expression), referenceNode);
		}
	}


	public createCommentNode(data: string): any
	{
		return new ASTHTMLNodeComment(data);
	}


	public getFirstChild(node: ASTHTMLNodeParent): ASTHTMLNode
	{
		return node.childNodes[0];
	}


	public getParentNode(node: ASTHTMLNode): ASTHTMLNodeParent
	{
		return node.parentNode;
	}


	public getTagName(element: ASTHTMLNodeElement): string
	{
		return element.name;
	}


	public getAttrList(element: ASTHTMLNodeElement): Array<ASTHTMLNodeAttribute>
	{
		return element.attributes;
	}


	public getNamespaceURI(element: _.Element): string
	{
		return 'http://www.w3.org/1999/xhtml';
	}


	public getChildNodes(node: _.ParentNode): Array<_.Node>
	{
		throw new Error('not implemented');
	}


	public getDocumentMode(document: _.Document): _.DocumentMode
	{
		throw new Error('not implemented');
	}


	public adoptAttributes(recipient: _.Element, attrs: Array<_.Default.Attribute>): void
	{
		throw new Error('not implemented');
	}


	public getTextNodeContent(textNode: _.TextNode): string
	{
		throw new Error('not implemented');
	}


	public getCommentNodeContent(commentNode: _.CommentNode): string
	{
		throw new Error('not implemented');
	}


	public getDocumentTypeNodeName(doctypeNode: _.DocumentType): string
	{
		throw new Error('not implemented');
	}


	public getDocumentTypeNodePublicId(doctypeNode: _.DocumentType): string
	{
		throw new Error('not implemented');
	}


	public getDocumentTypeNodeSystemId(doctypeNode: _.DocumentType): string
	{
		throw new Error('not implemented');
	}


	public isTextNode(node: _.Node): boolean
	{
		throw new Error('not implemented');
	}


	public isCommentNode(node: _.Node): boolean
	{
		throw new Error('not implemented');
	}


	public isDocumentTypeNode(node: _.Node): boolean
	{
		throw new Error('not implemented');
	}


	public isElementNode(node: _.Node): boolean
	{
		throw new Error('not implemented');
	}


	private processAttributes(element: ASTHTMLNodeElement, attrs: Array<_.Default.Attribute>): void
	{
		forEach(attrs, (attribute: _.Default.Attribute) => {
			if (attribute.name.match(/^\[\(.+\)\]$/)) {
				const name = attribute.name.substring(2, attribute.name.length - 2);

				element.twoWayBinding.push(new ASTHTMLNodeExpressionAttribute(name, attribute.value));

			} else if (attribute.name.match(/^\(.+\)$/)) {
				let eventsName = attribute.name.substring(1, attribute.name.length - 1).split('|');

				forEach(eventsName, (eventName: string) => {
					let eventNameParts = eventName.split('.');
					let event = new ASTHTMLNodeExpressionAttributeEvent(eventNameParts[0], attribute.value);

					if (exists(eventNameParts[1]) && eventNameParts[1] === 'prevent') {
						event.preventDefault = true;
					}

					element.events.push(event);
				});

			} else if (attribute.name.match(/^\[.+\]/)) {
				element.properties.push(new ASTHTMLNodeExpressionAttribute(attribute.name.substring(1, attribute.name.length - 1), attribute.value));

			} else if (attribute.name.charAt(0) === '#') {
				element.exports.push(new ASTHTMLNodeTextAttribute(attribute.name.substring(1), attribute.value));

			} else if (attribute.name.charAt(0) === '*') {
				element.templates.push(new ASTHTMLNodeExpressionAttribute(attribute.name.substring(1), attribute.value));

			} else {
				element.attributes.push(new ASTHTMLNodeTextAttribute(attribute.name, attribute.value));
			}
		});
	}


	private createTextNode(text: string): ASTHTMLNodeText
	{
		return new ASTHTMLNodeText(text);
	}


	private createExpressionNode(expression: string): ASTHTMLNodeExpression
	{
		return new ASTHTMLNodeExpression(expression);
	}

}
