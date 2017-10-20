import * as _ from '@slicky/html-parser';
import {forEach} from '@slicky/utils';
import {EnginePlugin, OnBeforeProcessElementArgument} from '../engine/enginePlugin';


export class TwoWayBindingPlugin extends EnginePlugin
{


	public onBeforeProcessElement(element: _.ASTHTMLNodeElement, arg: OnBeforeProcessElementArgument): _.ASTHTMLNodeElement
	{
		forEach(element.twoWayBinding, (binding: _.ASTHTMLNodeExpressionAttribute) => {
			element.properties.push(binding);
			element.events.push(new _.ASTHTMLNodeExpressionAttributeEvent(`${binding.name}-change`, `${binding.value} = $event`));
		});

		return element;
	}

}
