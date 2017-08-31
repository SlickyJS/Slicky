import * as _ from '@slicky/html-parser';
import {find, map, exists} from '@slicky/utils';
import {EnginePlugin, OnProcessTemplateArgument} from '../enginePlugin';
import * as b from '../builder';


export class ForEnginePlugin extends EnginePlugin
{


	public onProcessTemplate(arg: OnProcessTemplateArgument): void
	{
		let loop: _.ASTHTMLNodeAttribute = find(arg.element.properties, (property: _.ASTHTMLNodeAttribute) => {
			return property.name === 's:for';
		});

		if (!loop) {
			return;
		}

		let trackBy = find(arg.element.properties, (property: _.ASTHTMLNodeExpressionAttribute) => {
			return property.name === 's:for-track-by';
		});

		let forLoop = this.parseFor(loop.value);

		arg.progress.localVariables.push(forLoop.forItem);

		if (forLoop.forIndex) {
			arg.progress.localVariables.push(forLoop.forIndex);
		}

		arg.comment.setup.add(
			b.createForOfHelper(arg.template.id, arg.engine.compileExpression(forLoop.forOf, arg.progress, true), forLoop.forItem, forLoop.forIndex, trackBy ? arg.engine.compileExpression(trackBy.value, arg.progress) : null)
		);
	}


	private parseFor(loop: string): {forOf: string, forItem: string, forIndex: string}
	{
		let parts = map(loop.split('of'), (part: string) => part.trim());
		let exports = map(parts[0].split(','), (exp: string) => exp.trim());

		return {
			forOf: parts[1],
			forItem: exports[0],
			forIndex: exists(exports[1]) ? exports[1] : null,
		};
	}

}
