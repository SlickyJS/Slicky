import {DirectiveDefinitionType} from '@slicky/core/metadata';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {exists, find, hyphensToCamelCase} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstractSlickyEnginePlugin';
import {ElementProcessingDirective} from '../slickyEnginePlugin';


export class ExportAsPlugin extends AbstractSlickyEnginePlugin
{


	public onBeforeProcessDirective(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, arg: OnProcessElementArgument): void
	{
		if (exists(directive.directive.metadata.exportAs)) {
			const exportInto = find(element.exports, (elementExport: _.ASTHTMLNodeTextAttribute) => {
				if (elementExport.value === '' || directive.directive.metadata.exportAs.indexOf(elementExport.value) >= 0) {
					return true;
				}
			});

			if (exists(exportInto)) {
				const exportIntoTemplate = directive.directive.metadata.type === DirectiveDefinitionType.Component ?
					'outer' :
					'template'
				;

				arg.progress.localVariables.push(hyphensToCamelCase(exportInto.name));
				directive.setup.body.add(`${exportIntoTemplate}.setParameter("${hyphensToCamelCase(exportInto.name)}", directive);`);
				element.exports.splice(element.exports.indexOf(exportInto), 1);
			}
		}
	}

}
