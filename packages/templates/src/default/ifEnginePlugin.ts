import * as _ from '@slicky/html-parser';
import {find} from '@slicky/utils';
import {EnginePlugin, OnProcessTemplateArgument} from '../enginePlugin';


export class IfEnginePlugin extends EnginePlugin
{


	public onProcessTemplate(arg: OnProcessTemplateArgument): void
	{
		let condition: _.ASTHTMLNodeAttribute = find(arg.element.properties, (property: _.ASTHTMLNodeAttribute) => {
			return property.name === 's:if';
		});

		if (!condition) {
			return;
		}

		arg.comment.addSetupIf(arg.template.id, arg.engine.compileExpression(condition.value, arg.progress, true));
	}

}
