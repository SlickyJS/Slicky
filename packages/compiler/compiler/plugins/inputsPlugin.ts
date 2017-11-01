import {DirectiveDefinitionInput, DirectiveDefinitionType} from '@slicky/core/metadata';
import {OnProcessElementArgument} from '@slicky/templates-compiler';
import {exists, find, forEach, indent} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import {AbstractSlickyEnginePlugin} from '../abstractSlickyEnginePlugin';
import {ElementProcessingDirective} from '../slickyEnginePlugin';


export class InputsPlugin extends AbstractSlickyEnginePlugin
{


	public onBeforeProcessDirective(element: _.ASTHTMLNodeElement, directive: ElementProcessingDirective, arg: OnProcessElementArgument): void
	{
		forEach(directive.directive.metadata.inputs, (input: DirectiveDefinitionInput) => {
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
				throw new Error(`${directive.directive.metadata.name}.${input.property}: required input is not set in <${element.name}> tag.`);
			}

			if (!exists(property)) {
				return;
			}

			if (isProperty || property instanceof _.ASTHTMLNodeExpressionAttribute) {
				const watchUpdate = [
					`directive.${input.property} = value;`,
				];

				if (directive.directive.metadata.onUpdate) {
					if (directive.directive.metadata.type === DirectiveDefinitionType.Component) {
						watchUpdate.push(
							'template.run(function() {\n' +
							`	directive.onUpdate("${property.name}", value);\n` +
							'});'
						)
					} else {
						watchUpdate.push(`directive.onUpdate("${property.name}", value);`);
					}
				}

				if (directive.directive.metadata.type === DirectiveDefinitionType.Component) {
					watchUpdate.push('template.markForRefresh();');
				}

				directive.setup.body.add(
					`${directive.directive.metadata.type === DirectiveDefinitionType.Component ? 'outer' : 'template'}.watch(function() {\n` +
					`	${arg.engine._compileExpression(property.value, arg.progress, true, true)};\n` +
					`}, function(value) {\n` +
					`${indent(watchUpdate.join('\n'))}\n` +
					`});`
				);

			} else {
				directive.setup.body.add(`directive.${input.property} = "${property.value}";`);

				if (directive.directive.metadata.onUpdate) {
					if (directive.directive.metadata.type === DirectiveDefinitionType.Component) {
						directive.setup.body.add(
							'template.run(function() {\n' +
							`	directive.onUpdate("${input.property}", "${property.value}");\n` +
							'});'
						)
					} else {
						directive.setup.body.add(`directive.onUpdate("${input.property}", "${property.value}");`);
					}
				}
			}

			if (isProperty) {
				element.properties.splice(element.properties.indexOf(property), 1);
			} else {
				//element.attributes.splice(element.attributes.indexOf(property), 1);
			}
		});
	}

}
