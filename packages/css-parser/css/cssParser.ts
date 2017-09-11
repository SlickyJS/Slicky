import {map} from '@slicky/utils';
import * as csstree from 'css-tree';
import * as n from './nodes';


export class CSSParser
{


	public parse(code: string): n.CSSNodeStylesheet
	{
		const ast = csstree.parse(code, {
			parseValue: false,
			parseAtrulePrelude: false,
		});

		const stylesheet = new n.CSSNodeStylesheet;
		const processedRules: Array<any> = [];

		csstree.walkRules(ast, (node) => {
			if (node.type === 'Atrule') {
				if (node.name !== 'media') {
					throw new Error(`CSSParser: unsupported @${node.name} rule.`);
				}

				const media = new n.CSSNodeMediaRule(csstree.translate(node.prelude));

				csstree.walkRules(node.block, (subNode) => {
					processedRules.push(subNode);
					media.rules.push(this.createCSSRule(subNode));
				});

				stylesheet.mediaRules.push(media);
			}
		});

		csstree.walkRules(ast, (node) => {
			if (node.type === 'Rule') {
				if (processedRules.indexOf(node) >= 0) {
					return;
				}

				stylesheet.rules.push(this.createCSSRule(node));
			}
		});

		return stylesheet;
	}


	private createCSSRule(node: any): n.CSSNodeRule
	{
		const selectors = map(node.selector.children.toArray(), (selector) => {
			return new n.CSSNodeSelector(csstree.translate(selector));
		});

		const currentRule = new n.CSSNodeRule(selectors);

		csstree.walkDeclarations(node.block, (rule) => {
			currentRule.declarations.push(new n.CSSNodeDeclaration(rule.property.trim(), rule.value.value.trim(), rule.important));
		});

		return currentRule;
	}

}
