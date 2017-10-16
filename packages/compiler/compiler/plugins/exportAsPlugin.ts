import {DirectiveDefinitionDirective, DirectiveDefinitionType} from '@slicky/core/metadata';
import {BuilderFunction} from '@slicky/templates-compiler/builder';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {exists, find, hyphensToCamelCase} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstracSlickyEnginePlugin';


export class ExportAsPlugin extends AbstractSlickyEnginePlugin
{


	public onSlickyProcessDirective(element: _.ASTHTMLNodeElement, directive: DirectiveDefinitionDirective, directiveId: number, directiveSetup: BuilderFunction, arg: OnProcessElementArgument): void
	{
		if (exists(directive.metadata.exportAs)) {
			const exportInto = find(element.exports, (elementExport: _.ASTHTMLNodeTextAttribute) => {
				if (elementExport.value === '' || elementExport.value === directive.metadata.exportAs) {
					return true;
				}
			});

			if (exists(exportInto)) {
				const exportIntoTemplate = directive.metadata.type === DirectiveDefinitionType.Component ?
					'outer' :
					'template'
				;

				arg.progress.localVariables.push(hyphensToCamelCase(exportInto.name));
				directiveSetup.body.add(`${exportIntoTemplate}.setParameter("${hyphensToCamelCase(exportInto.name)}", directive);`);
				element.exports.splice(element.exports.indexOf(exportInto), 1);
			}
		}
	}

}
