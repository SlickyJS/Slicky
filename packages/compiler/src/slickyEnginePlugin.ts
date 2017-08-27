import {EnginePlugin, OnProcessElementArgument, OnExpressionVariableHookArgument} from '@slicky/templates';
import {forEach, find, exists} from '@slicky/utils';
import * as c from '@slicky/core';
import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import * as s from './nodes';
import {Compiler} from './compiler';


export class SlickyEnginePlugin extends EnginePlugin
{


	private compiler: Compiler;

	private metadata: c.DirectiveDefinition;

	private expressionInParent: boolean = false;


	constructor(compiler: Compiler, metadata: c.DirectiveDefinition)
	{
		super();

		this.compiler = compiler;
		this.metadata = metadata;
	}


	public onProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): _.ASTHTMLNodeElement
	{
		forEach(this.metadata.elements, (hostElement: c.DirectiveDefinitionElement) => {
			if (!arg.matcher.matches(element, hostElement.selector)) {
				return;
			}

			arg.element.addSetup(new s.TemplateSetupComponentHostElement(hostElement.property));
		});

		forEach(this.metadata.directives, (directive: c.DirectiveDefinitionDirective) => {
			if (!arg.matcher.matches(element, directive.metadata.selector)) {
				return;
			}

			if (directive.metadata.type === c.DirectiveDefinitionType.Component) {
				this.compiler.compile(directive.metadata);
			}

			arg.element.addSetup(new s.TemplateSetupDirective(directive.metadata.hash, directive.metadata.type), (setup: s.TemplateSetupDirective) => {
				let onTemplateDestroy: Array<string> = [];

				forEach(directive.metadata.inputs, (input: c.DirectiveDefinitionInput) => {
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
						// todo: error
					}

					if (!exists(property)) {
						return;
					}

					if (isProperty) {
						element.properties.splice(element.properties.indexOf(property), 1);

						let directiveUpdate = directive.metadata.onUpdate ?
							`; \ndirective.onUpdate('${property.name}', value)` :
							''
						;

						this.expressionInParent = true;
						setup.addSetupWatch(arg.engine.compileExpression(property.value, arg.progress, true), `directive.${input.property} = value${directiveUpdate}`);
						this.expressionInParent = false;

					} else {
						element.attributes.splice(element.attributes.indexOf(property), 1);
						setup.addSetup(new s.TemplateSetupDirectivePropertyWrite(input.property, `"${property.value}"`));

						if (directive.metadata.onUpdate) {
							setup.addSetup(new s.TemplateSetupDirectiveMethodCall('onUpdate', `"${input.property}", "${property.value}"`));
						}
					}
				});

				forEach(directive.metadata.outputs, (output: c.DirectiveDefinitionOutput) => {
					let event: _.ASTHTMLNodeExpressionAttributeEvent = find(element.events, (event: _.ASTHTMLNodeExpressionAttributeEvent) => {
						return event.name === output.name;
					});

					if (event) {
						element.events.splice(element.events.indexOf(event), 1);
					}

					setup.addSetup(new s.TemplateSetupDirectiveOutput(output.property, arg.engine.compileExpression(event.value, arg.progress)));
				});

				let removeChildDirectives = [];
				forEach(this.metadata.childDirectives, (childDirective: c.DirectiveDefinitionChildDirective, i: number) => {
					if (childDirective.directiveType === directive.directiveType && !arg.progress.inTemplate) {
						setup.addSetup(new s.TemplateSetupDirectivePropertyWrite(childDirective.property, 'directive', true));
						removeChildDirectives.push(i);
					}
				});

				forEach(removeChildDirectives, (i: number) => {
					this.metadata.childDirectives.splice(i, 1);
				});

				let removeChildrenDirectives = [];
				forEach(this.metadata.childrenDirectives, (childrenDirectives: c.DirectiveDefinitionChildrenDirective, i: number) => {
					if (childrenDirectives.directiveType === directive.directiveType) {
						setup.addSetup(new s.TemplateSetupDirectiveMethodCall(`${childrenDirectives.property}.add.emit`, 'directive', true));
						onTemplateDestroy.push(`root.getProvider("component").${childrenDirectives.property}.remove.emit(directive);`);
						removeChildrenDirectives.push(i);
					}
				});

				forEach(removeChildrenDirectives, (i: number) => {
					this.metadata.childrenDirectives.splice(i, 1);
				});

				if (directive.metadata.onDestroy) {
					onTemplateDestroy.push('directive.onDestroy()');
				}

				if (onTemplateDestroy.length) {
					setup.addSetup(new s.TemplateSetupTemplateOnDestroy(onTemplateDestroy.join('\n')));
				}

				if (directive.metadata.onInit) {
					setup.addSetup(new s.TemplateSetupDirectiveOnInit);
				}

				if (directive.metadata.type === c.DirectiveDefinitionType.Component) {
					setup.addSetup(new s.TemplateSetupComponentRender);
				}
			});
		});

		return element;
	}


	public onExpressionVariableHook(identifier: tjs.ASTCallExpression, arg: OnExpressionVariableHookArgument): tjs.ASTExpression
	{
		let parameter: string = (<tjs.ASTStringLiteral>identifier.arguments[0]).value;

		if (parameter === '$value') {
			return new tjs.ASTIdentifier(parameter);
		}

		if (arg.progress.localVariables.indexOf(parameter) >= 0) {
			if (this.expressionInParent) {

				// tmpl.parent.getParameter('variableName')
				return new tjs.ASTCallExpression(
					new tjs.ASTMemberExpression(
						new tjs.ASTMemberExpression(
							new tjs.ASTIdentifier('tmpl'),
							new tjs.ASTIdentifier('parent')
						),
						new tjs.ASTIdentifier('getParameter')
					),
					[
						new tjs.ASTStringLiteral(parameter),
					]
				);
			}

			// tmpl.getParameter('variableName')
			return identifier;
		}

		// root.getProvider('component').variableName
		return new tjs.ASTMemberExpression(
			new tjs.ASTCallExpression(
				new tjs.ASTMemberExpression(
					new tjs.ASTIdentifier('root'),
					new tjs.ASTIdentifier('getProvider')
				),
				[
					new tjs.ASTStringLiteral('component'),
				]
			),
			new tjs.ASTIdentifier(parameter)
		);
	}

}
