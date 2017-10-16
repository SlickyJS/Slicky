import {DirectiveDefinitionDirective, DirectiveDefinitionOutput, DirectiveDefinitionType} from '@slicky/core/metadata';
import {BuilderFunction} from '@slicky/templates-compiler/builder';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {forEach, find} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstracSlickyEnginePlugin';


export class OutputsPlugin extends AbstractSlickyEnginePlugin
{


	public onSlickyProcessDirective(element: _.ASTHTMLNodeElement, directive: DirectiveDefinitionDirective, directiveId: number, directiveSetup: BuilderFunction, arg: OnProcessElementArgument): void
	{
		forEach(directive.metadata.outputs, (output: DirectiveDefinitionOutput) => {
			let event: _.ASTHTMLNodeExpressionAttributeEvent = find(element.events, (event: _.ASTHTMLNodeExpressionAttributeEvent) => {
				return event.name === output.name;
			});

			if (event) {
				element.events.splice(element.events.indexOf(event), 1);
			}

			directiveSetup.body.add(
				`directive.${output.property}.subscribe(function($event) {\n` +
				`	${directive.metadata.type === DirectiveDefinitionType.Component ? 'outer' : 'template'}.run(function() {\n` +
				`		${arg.engine._compileExpression(event.value, arg.progress)};\n` +
				`	});\n` +
				`});`
			);
		});
	}

}
