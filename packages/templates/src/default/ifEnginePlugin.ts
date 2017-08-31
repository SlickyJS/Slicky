import * as _ from '@slicky/html-parser';
import {find} from '@slicky/utils';
import {EnginePlugin, OnProcessTemplateArgument} from '../enginePlugin';
import * as b from '../builder';


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

		arg.comment.setup.add(
			b.createIfHelper(arg.template.id, arg.engine.compileExpression(condition.value, arg.progress, true))
		);
	}

}
