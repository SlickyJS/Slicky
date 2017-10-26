import {DirectiveDefinitionOutput, DirectiveDefinitionType} from '@slicky/core/metadata';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {forEach, find, exists} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstractSlickyEnginePlugin';
import {ElementProcessingDirective} from '../slickyEnginePlugin';


export class OutputsPlugin extends AbstractSlickyEnginePlugin
{


	public onBeforeProcessDirective(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, arg: OnProcessElementArgument): void
	{
		forEach(directive.directive.metadata.outputs, (output: DirectiveDefinitionOutput) => {
			let event: _.ASTHTMLNodeExpressionAttributeEvent = find(element.events, (event: _.ASTHTMLNodeExpressionAttributeEvent) => {
				return event.name === output.name;
			});

			if (!exists(event)) {
				return;
			}

			element.events.splice(element.events.indexOf(event), 1);

			directive.setup.body.add(
				`directive.${output.property}.subscribe(function($event) {\n` +
				`	${directive.directive.metadata.type === DirectiveDefinitionType.Component ? 'outer' : 'template'}.run(function() {\n` +
				`		${arg.engine._compileExpression(event.value, arg.progress)};\n` +
				`	});\n` +
				`});`
			);
		});
	}

}
