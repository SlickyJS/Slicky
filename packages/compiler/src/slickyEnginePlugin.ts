import {EnginePlugin, OnProcessElementArgument, OnExpressionVariableHookArgument} from '@slicky/templates';
import {DirectiveDefinition, DirectiveDefinitionDirective, DirectiveDefinitionInput, DirectiveDefinitionOutput, DirectiveDefinitionElement} from '@slicky/core';
import {forEach, find} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import {Compiler} from './compiler';
import {TemplateSetupComponent, TemplateSetupComponentRender, TemplateSetupDirectiveOutput, TemplateSetupDirectiveOnInit, TemplateSetupDirectiveOnDestroy, TemplateSetupComponentHostElement} from './nodes';


export class SlickyEnginePlugin extends EnginePlugin
{


	private compiler: Compiler;

	private metadata: DirectiveDefinition;

	private expressionInParent: boolean = false;


	constructor(compiler: Compiler, metadata: DirectiveDefinition)
	{
		super();

		this.compiler = compiler;
		this.metadata = metadata;
	}


	public onProcessElement(element: _.ASTHTMLNodeElement, arg: OnProcessElementArgument): _.ASTHTMLNodeElement
	{
		forEach(this.metadata.elements, (hostElement: DirectiveDefinitionElement) => {
			if (!arg.matcher.matches(element, hostElement.selector)) {
				return;
			}

			arg.element.addSetup(new TemplateSetupComponentHostElement(hostElement.property));
		});

		forEach(this.metadata.directives, (directive: DirectiveDefinitionDirective) => {
			if (!arg.matcher.matches(element, directive.metadata.selector)) {
				return;
			}

			this.compiler.compile(directive.metadata);

			arg.element.addSetup(new TemplateSetupComponent(directive.metadata.hash), (setup: TemplateSetupComponent) => {
				forEach(directive.metadata.inputs, (input: DirectiveDefinitionInput) => {
					let property: _.ASTHTMLNodeExpressionAttribute = find(element.properties, (property: _.ASTHTMLNodeExpressionAttribute) => {
						return property.name === input.name;
					});

					if (property) {
						element.properties.splice(element.properties.indexOf(property), 1);
					} else if (input.required) {
						// todo: error
					}

					this.expressionInParent = true;
					setup.addSetupWatch(arg.engine.compileExpression(property.value, arg.progress, true), `tmpl.getProvider("component").${input.property} = value`);
					this.expressionInParent = false;
				});

				forEach(directive.metadata.outputs, (output: DirectiveDefinitionOutput) => {
					let event: _.ASTHTMLNodeExpressionAttributeEvent = find(element.events, (event: _.ASTHTMLNodeExpressionAttributeEvent) => {
						return event.name === output.name;
					});

					if (event) {
						element.events.splice(element.events.indexOf(event), 1);
					}

					setup.addSetup(new TemplateSetupDirectiveOutput(output.property, arg.engine.compileExpression(event.value, arg.progress)));
				});

				if (directive.metadata.onDestroy) {
					setup.addSetup(new TemplateSetupDirectiveOnDestroy);
				}

				if (directive.metadata.onInit) {
					setup.addSetup(new TemplateSetupDirectiveOnInit);
				}

				setup.addSetup(new TemplateSetupComponentRender);
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
