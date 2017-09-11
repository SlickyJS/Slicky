import {map} from '@slicky/utils';
import * as csstree from 'css-tree';
import * as n from './nodes';


export class CSSParser
{


	public parse(code: string): Array<n.CSSNodeRule>
	{
		const ast = csstree.parse(code, {
			parseValue: false,
		});

		let result: Array<n.CSSNodeRule> = [];

		csstree.walkRules(ast, (node) => {
			const selectors = map(node.selector.children.toArray(), (selector) => {
				return new n.CSSNodeSelector(csstree.translate(selector));
			});

			const currentRule = new n.CSSNodeRule(selectors);

			csstree.walkDeclarations(node.block, (rule) => {
				currentRule.declarations.push(new n.CSSNodeDeclaration(rule.property.trim(), rule.value.value.trim(), rule.important));
			});

			result.push(currentRule);
		});

		return result;
	}

}
