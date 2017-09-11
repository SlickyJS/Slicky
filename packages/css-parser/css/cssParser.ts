import * as csstree from 'css-tree';
import * as n from './nodes';


export class CSSParser
{


	public parse(code: string): Array<n.CSSNodeSelector>
	{
		const ast = csstree.parse(code, {
			parseSelector: false,
			parseValue: false,
		});

		let result: Array<n.CSSNodeSelector> = [];

		csstree.walkRules(ast, (node) => {
			const current = new n.CSSNodeSelector(node.selector.value.trim());

			csstree.walkDeclarations(node.block, (rule) => {
				current.rules.push(new n.CSSNodeRule(rule.property.trim(), rule.value.value.trim(), rule.important));
			});

			result.push(current);
		});

		return result;
	}

}
