import {DirectiveDefinitionDirective, DirectiveDefinitionType} from '@slicky/core/metadata';
import {BuilderFunction} from '@slicky/templates-compiler/builder';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import * as _ from '@slicky/html-parser';
import {SlickyEnginePlugin} from '../slickyEnginePlugin';


export class LifeCycleEventsPlugin extends SlickyEnginePlugin
{


	public onSlickyProcessDirective(element: _.ASTHTMLNodeElement, directive: DirectiveDefinitionDirective, directiveId: number, directiveSetup: BuilderFunction, arg: OnProcessElementArgument): void
	{
		if (directive.metadata.type === DirectiveDefinitionType.Component) {
			if (directive.metadata.onInit) {
				directiveSetup.body.add(
					'template.run(function() {\n' +
					'	directive.onInit();\n' +
					'});'
				);
			}

		} else if (directive.metadata.onInit) {
			directiveSetup.body.add('directive.onInit();');
		}

		if (directive.metadata.onDestroy) {
			directiveSetup.body.add(
				'template.onDestroy(function() {\n' +
				'	directive.onDestroy();\n' +
				'});'
			);
		}
	}

}
