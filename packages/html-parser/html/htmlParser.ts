import {parseFragment} from 'parse5';
import {forEach, map, startsWith, keys, find, exists} from '@slicky/utils';
import {InputStream} from '@slicky/tokenizer';
import {TextTokenizer, TextToken, TextTokenText, TextTokenExpression} from '../text';
import * as _ from './ast';


export class HTMLParser
{


	private input: string;

	private ast: _.AST;


	constructor(input: string)
	{
		this.input = input;
		this.ast = new _.AST;
	}


	public parse(): _.ASTHTMLNodeDocumentFragment
	{
		let document = <_.ASTHTMLNodeDocumentFragment>parseFragment(this.input, {
			treeAdapter: this.ast,
		});

		this.process(document);

		return document;
	}


	private process(document: _.ASTHTMLNodeDocumentFragment): void
	{
		this.processChildNodes(document.childNodes);
	}


	private processChildNodes(childNodes: Array<_.ASTHTMLNode>): void
	{
		for (let i = 0; i < childNodes.length; i++) {
			let node = childNodes[i];

			if (node instanceof _.ASTHTMLNodeBaseText) {
				i += this.processText(node);

			} else if (node instanceof _.ASTHTMLNodeElement) {
				this.processElement(node);
			}
		}
	}


	private processText(text: _.ASTHTMLNodeBaseText): number
	{
		let tokens = this.tokenizeText(text.value);

		forEach(tokens, (token: TextToken) => {
			if (token instanceof TextTokenText) {
				this.ast.insertTextBefore(text.parentNode, token.value, text);

			} else if (token instanceof TextTokenExpression) {
				this.ast.insertExpressionBefore(text.parentNode, token.value, text);
			}
		});

		this.ast.detachNode(text);

		return tokens.length - 1;
	}


	private processElement(element: _.ASTHTMLNodeElement): void
	{
		if (exists(element.templates)) {
			element = this.processElementTemplates(element);
		}

		element.attributes = this.processElementAttributes(element.attributes);
		this.processChildNodes(element.childNodes);

		if (element.content) {
			this.processChildNodes(element.content.childNodes);
		}
	}


	private processElementTemplates(element: _.ASTHTMLNodeElement): _.ASTHTMLNodeElement
	{
		let templates = element.templates;
		element.templates = [];

		let templatesGroups: {[prefix: string]: Array<_.ASTHTMLNodeExpressionAttribute>} = {};

		forEach(templates, (template: _.ASTHTMLNodeExpressionAttribute) => {
			let found = find(keys(templatesGroups), (name: string) => startsWith(template.name, name));

			if (!found) {
				templatesGroups[template.name] = [];
				found = template.name;
			}

			templatesGroups[found].push(template);
		});

		let marker = element;
		forEach(templatesGroups, (group: Array<_.ASTHTMLNodeExpressionAttribute>) => {
			let template = new _.ASTHTMLNodeElement('template');
			template.properties = group;

			if (marker === element) {
				this.ast.insertBefore(marker.parentNode, template, marker);
			} else {
				this.ast.appendChild(marker, template);
			}

			marker = template;
		});

		if (marker !== element) {
			this.ast.detachNode(element);
			this.ast.appendChild(marker, element);
		}

		return marker;
	}


	private processElementAttributes(attributes: Array<_.ASTHTMLNodeTextAttribute>): Array<_.ASTHTMLNodeAttribute>
	{
		let result: Array<_.ASTHTMLNodeAttribute> = [];

		forEach(attributes, (attribute: _.ASTHTMLNodeTextAttribute) => {
			let tokens = this.tokenizeText(attribute.value);

			if (tokens.length === 0 || (tokens.length === 1 && tokens[0] instanceof TextTokenText)) {
				result.push(attribute);

			} else {
				result.push(new _.ASTHTMLNodeExpressionAttribute(
					attribute.name,
					map(tokens, (token: TextToken) => {
						return (token instanceof TextTokenExpression) ?
							`(${token.value})` :
							`"${token.value}"`
						;
					}).join(' + ')
				));
			}
		});

		return result;
	}


	private tokenizeText(text: string): Array<TextToken>
	{
		return (new TextTokenizer(new InputStream(text))).tokenize();
	}

}
