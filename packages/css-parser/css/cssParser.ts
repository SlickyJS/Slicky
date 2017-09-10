import * as csstree from 'css-tree';
import * as n from './nodes';


export class CSSParser
{


	public parse(code: string): Array<n.CSSNodeSelector>
	{
		const ast = csstree.parse(code, {
			//parseSelector: false,			// todo: uncomment when https://github.com/csstree/csstree/issues/56 is fixed
			parseValue: false,
		});

		let result: Array<n.CSSNodeSelector> = [];

		csstree.walkRules(ast, (node) => {
			const selector = csstree.translate(node.selector);
			const current = new n.CSSNodeSelector(selector);

			csstree.walkDeclarations(node.block, (rule) => {
				current.rules.push(new n.CSSNodeRule(rule.property.trim(), rule.value.value.trim(), rule.important));
			});

			result.push(current);
		});

		return result;
	}

}
