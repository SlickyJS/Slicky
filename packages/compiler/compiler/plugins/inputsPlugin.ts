import {DirectiveDefinitionDirective, DirectiveDefinitionInput, DirectiveDefinitionType} from '@slicky/core/metadata';
import {BuilderFunction} from '@slicky/templates-compiler/builder';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {exists, find, forEach, indent} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstracSlickyEnginePlugin';


export class InputsPlugin extends AbstractSlickyEnginePlugin
{


	public onSlickyProcessDirective(element: _.ASTHTMLNodeElement, directive: DirectiveDefinitionDirective, directiveId: number, directiveSetup: BuilderFunction, arg: OnProcessElementArgument): void
	{
		forEach(directive.metadata.inputs, (input: DirectiveDefinitionInput) => {
			let property: _.ASTHTMLNodeAttribute;
			let isProperty: boolean = false;

			let propertyFinder = (isProp: boolean) => {
				return (prop: _.ASTHTMLNodeAttribute) => {
					if (prop.name === input.name) {
						property = prop;
						isProperty = isProp;

						return true;
					}
				}
			};

			property =
				find(element.properties, propertyFinder(true)) ||
				find(element.attributes, propertyFinder(false))
			;

			if (!exists(property) && input.required) {
				throw new Error(`${directive.metadata.name}.${input.property}: required input is not set in <${element.name}> tag.`);
			}

			if (!exists(property)) {
				return;
			}

			if (isProperty || property instanceof _.ASTHTMLNodeExpressionAttribute) {
				const watchUpdate = [
					`directive.${input.property} = value;`,
				];

				if (directive.metadata.onUpdate) {
					watchUpdate.push(`directive.onUpdate("${property.name}", value);`);
				}

				if (directive.metadata.type === DirectiveDefinitionType.Component) {
					watchUpdate.push('template.refresh();');
				}

				directiveSetup.body.add(
					`${directive.metadata.type === DirectiveDefinitionType.Component ? 'outer' : 'template'}.watch(function() {\n` +
					`	${arg.engine._compileExpression(property.value, arg.progress, true, true)};\n` +
					`}, function(value) {\n` +
					`${indent(watchUpdate.join('\n'))}\n` +
					`});`
				);

			} else {
				directiveSetup.body.add(`directive.${input.property} = "${property.value}";`);

				if (directive.metadata.onUpdate) {
					directiveSetup.body.add(`directive.onUpdate("${input.property}", "${property.value}");`);
				}
			}

			if (isProperty) {
				element.properties.splice(element.properties.indexOf(property), 1);
			} else {
				element.attributes.splice(element.attributes.indexOf(property), 1);
			}
		});
	}

}