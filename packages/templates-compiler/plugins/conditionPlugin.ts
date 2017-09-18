import * as _ from '@slicky/html-parser';
import {find} from '@slicky/utils';
import {EnginePlugin, OnProcessTemplateArgument} from '../engine/enginePlugin';


export class ConditionPlugin extends EnginePlugin
{


	public onProcessTemplate(arg: OnProcessTemplateArgument): void
	{
		let condition: _.ASTHTMLNodeAttribute = find(arg.element.properties, (property: _.ASTHTMLNodeAttribute) => {
			return property.name === 's:if';
		});

		if (!condition) {
			return;
		}

		arg.render.body.add(
			`template.addCondition(function(template, el) {\n` +
			`	${arg.engine._compileExpression(condition.value, arg.progress, true)};\n` +
			`}, "${arg.template.name}");`
		);
	}

}
