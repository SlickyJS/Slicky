import * as _ from '@slicky/html-parser';
import {find, map, exists} from '@slicky/utils';
import {EnginePlugin, OnProcessTemplateArgument} from '../engine/enginePlugin';


export class LoopPlugin extends EnginePlugin
{


	public onProcessTemplate(arg: OnProcessTemplateArgument): void
	{
		const loop: _.ASTHTMLNodeAttribute = find(arg.element.properties, (property: _.ASTHTMLNodeAttribute) => {
			return property.name === 's:for';
		});

		if (!loop) {
			return;
		}

		const trackBy: _.ASTHTMLNodeExpressionAttribute = find(arg.element.properties, (property: _.ASTHTMLNodeExpressionAttribute) => {
			return property.name === 's:for-track-by';
		});

		const forLoop = this.parseFor(loop.value);

		arg.progress.localVariables.push(forLoop.forItem);

		if (forLoop.forIndex) {
			arg.progress.localVariables.push(forLoop.forIndex);
		}

		const loopOptions = [
			`iterator: "$iterator"`,
			`value: "${forLoop.forItem}"`
		];

		if (forLoop.forIndex !== null) {
			loopOptions.push(`index: "${forLoop.forIndex}"`);
		}

		const loopArguments = [
			`{${loopOptions.join(', ')}}`,
			`function() {\n` +
			`	${arg.engine._compileExpression(forLoop.forOf, arg.progress, true)};\n` +
			`}`,
			`"${arg.template.name}"`,
		];

		if (exists(trackBy)) {
			loopArguments.push(arg.engine._compileExpression(trackBy.value, arg.progress));
		}

		arg.render.body.add(`template.addLoop(${loopArguments.join(', ')});`);
	}


	private parseFor(loop: string): {forOf: string, forItem: string, forIndex: string}
	{
		let parts = map(loop.split('in'), (part: string) => part.trim());
		let exports = map(parts[0].split(','), (exp: string) => exp.trim());

		return {
			forOf: parts[1],
			forItem: exports[0],
			forIndex: exists(exports[1]) ? exports[1] : null,
		};
	}

}
