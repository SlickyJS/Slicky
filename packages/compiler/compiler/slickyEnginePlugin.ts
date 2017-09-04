import {forEach, find, exists} from '@slicky/utils';
import {EnginePlugin, OnProcessElementArgument, OnExpressionVariableHookArgument} from '@slicky/templates';
import * as tb from '@slicky/templates/builder';
import * as c from '@slicky/core/metadata';
import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import * as b from './nodes';
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

			arg.element.setup.add(
				b.createComponentSetHostElement(hostElement.property)
			);
		});

		forEach(this.metadata.directives, (directive: c.DirectiveDefinitionDirective) => {
			if (!arg.matcher.matches(element, directive.metadata.selector)) {
				return;
			}

			if (directive.metadata.type === c.DirectiveDefinitionType.Component) {
				this.compiler.compile(directive.metadata);
			}

			arg.element.setup.add(
				b.createCreateDirective(directive.metadata.hash, directive.metadata.type, (setup) => {
					let onTemplateDestroy: Array<tb.BuilderNodeInterface> = [];

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

							let watchOnParent = directive.metadata.type === c.DirectiveDefinitionType.Component;

							this.expressionInParent = true;
							setup.setup.add(
								tb.createWatch(
									arg.engine.compileExpression(property.value, arg.progress, true),
									(watcher) => {
										watcher.watchParent = watchOnParent;
										watcher.update.add(`directive.${input.property} = value;`);

										if (directive.metadata.onUpdate) {
											watcher.update.add(`directive.onUpdate('${property.name}', value);`);
										}

										if (directive.metadata.type === c.DirectiveDefinitionType.Component) {
											watcher.update.add('tmpl.refresh();');
										}
									}
								)
							);
							this.expressionInParent = false;

						} else {
							element.attributes.splice(element.attributes.indexOf(property), 1);
							setup.setup.add(
								b.createDirectivePropertyWrite(input.property, `"${property.value}"`)
							);

							if (directive.metadata.onUpdate) {
								setup.setup.add(
									b.createDirectiveMethodCall('onUpdate', [`"${input.property}"`, `"${property.value}"`])
								);
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

						setup.setup.add(
							b.createDirectiveOutput(output.property, arg.engine.compileExpression(event.value, arg.progress))
						);
					});

					let removeChildDirectives = [];
					forEach(this.metadata.childDirectives, (childDirective: c.DirectiveDefinitionChildDirective, i: number) => {
						if (childDirective.directiveType === directive.directiveType && !arg.progress.inTemplate) {
							removeChildDirectives.push(i);
							setup.setup.add(
								b.createDirectivePropertyWrite(childDirective.property, 'directive', true)
							);
						}
					});

					forEach(removeChildDirectives, (i: number) => {
						this.metadata.childDirectives.splice(i, 1);
					});

					let removeChildrenDirectives = [];
					forEach(this.metadata.childrenDirectives, (childrenDirectives: c.DirectiveDefinitionChildrenDirective, i: number) => {
						if (childrenDirectives.directiveType === directive.directiveType) {
							onTemplateDestroy.push(tb.createCode(`root.getProvider("component").${childrenDirectives.property}.remove.emit(directive);`));
							removeChildrenDirectives.push(i);
							setup.setup.add(
								b.createDirectiveMethodCall(`${childrenDirectives.property}.add.emit`, ['directive'], true)
							);
						}
					});

					forEach(removeChildrenDirectives, (i: number) => {
						this.metadata.childrenDirectives.splice(i, 1);
					});

					if (directive.metadata.onDestroy) {
						onTemplateDestroy.push(tb.createCode('directive.onDestroy();'));
					}

					if (onTemplateDestroy.length) {
						setup.setup.add(
							tb.createTemplateOnDestroy(false, (node) => node.callback.addList(onTemplateDestroy))
						);
					}

					if (directive.metadata.onInit) {
						setup.setup.add(
							b.createDirectiveOnInit()
						);
					}

					if (directive.metadata.type === c.DirectiveDefinitionType.Component) {
						setup.setup.add(
							b.createComponentRender()
						);
					}
				})
			);
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
