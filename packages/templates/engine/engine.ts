import {Matcher} from '@slicky/query-selector';
import {forEach, map, hyphensToCamelCase, find, merge, startsWith} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import {InputStream} from '@slicky/tokenizer';
import {EventEmitter} from '@slicky/event-emitter';
import {DocumentWalker} from '../querySelector';
import {EnginePluginManager} from './enginePluginManager';
import {EnginePlugin} from './enginePlugin';
import {IfEnginePlugin, ForEnginePlugin} from '../plugins';
import {EngineProgress} from './engineProgress';
import * as b from '../builder';


export class Engine
{


	public compiled = new EventEmitter<{name: string|number, code: string}>();

	private plugins: EnginePluginManager;


	constructor()
	{
		this.plugins = new EnginePluginManager;

		this.addPlugin(new IfEnginePlugin);
		this.addPlugin(new ForEnginePlugin);
	}


	public addPlugin(plugin: EnginePlugin): void
	{
		this.plugins.register(plugin);
	}


	public compile(name: string|number, template: string): string
	{
		let progress = new EngineProgress;
		let matcher = new Matcher(new DocumentWalker);
		let builder = new b.TemplateBuilder(name + '', matcher);
		let tree = (new _.HTMLParser(template)).parse();

		this.plugins.onBeforeCompile({
			progress: progress,
			engine: this,
		});

		this.processTree(builder, builder.getMainMethod().body, progress, matcher, tree);

		this.plugins.onAfterCompile({
			progress: progress,
			engine: this,
		});

		let code = builder.render();

		this.compiled.emit({
			name: name,
			code: code,
		});

		return code;
	}


	private processTree(builder: b.TemplateBuilder, method: b.BuilderNodesContainer<b.BuilderNodeInterface>, progress: EngineProgress, matcher: Matcher, parent: _.ASTHTMLNodeParent, insertBefore: boolean = false): void
	{
		forEach(parent.childNodes, (child: _.ASTHTMLNode) => {
			if (child instanceof _.ASTHTMLNodeElement) {
				this.processElement(builder, method, progress, matcher, child, insertBefore);

			} else if (child instanceof _.ASTHTMLNodeExpression) {
				this.processExpression(method, progress, child, insertBefore);

			} else if (child instanceof _.ASTHTMLNodeText) {
				this.processText(method, child, insertBefore);
			}
		});
	}


	private processExpression(parent: b.BuilderNodesContainer<b.BuilderNodeInterface>, progress: EngineProgress, expression: _.ASTHTMLNodeExpression, insertBefore: boolean = false): void
	{
		parent.add(
			b.createAddText('', !insertBefore, (text) => {
				text.setup.add(
					b.createWatch(
						this.compileExpression(expression.value, progress, true),
						(watcher) => watcher.update.add('text.nodeValue = value;')
					)
				);
			})
		);
	}


	private processText(parent: b.BuilderNodesContainer<b.BuilderNodeInterface>, text: _.ASTHTMLNodeText, insertBefore: boolean = false): void
	{
		let value = text.value;

		// replace non-breaking whitespaces with one whitespace
		value = value
			.replace(/[\u000d\u0009\u000a\u0020]/g, '\u0020')
			.replace(/\u0020{2,}/g, '\u0020')
		;

		if (value === '') {
			return;
		}

		parent.add(
			b.createAddText(value, !insertBefore)
		);
	}


	private processElement(builder: b.TemplateBuilder, parent: b.BuilderNodesContainer<b.BuilderNodeInterface>, progress: EngineProgress, matcher: Matcher, element: _.ASTHTMLNodeElement, insertBefore: boolean = false): void
	{
		element = this.plugins.onBeforeProcessElement(element, {
			progress: progress,
			matcher: matcher,
			engine: this,
		});

		if (element.name === 'include') {
			return this.processElementInclude(builder, parent, progress, element, insertBefore);
		}

		if (element.name === 'template') {
			return this.processElementTemplate(builder, parent, progress, matcher, element);
		}

		parent.add(
			b.createAddElement(element.name, !insertBefore, (el) => {
				this.plugins.onProcessElement(element, {
					element: el,
					progress: progress,
					matcher: matcher,
					engine: this,
				});

				forEach(element.events, (event: _.ASTHTMLNodeExpressionAttributeEvent) => {
					el.setup.add(
						b.createElementEventListener(event.name, this.compileExpression(event.value, progress), event.preventDefault)
					);
				});

				forEach(element.properties, (property: _.ASTHTMLNodeExpressionAttribute) => {
					// todo: check if property is valid html property

					if (startsWith(property.name, 'class.')) {
						let className = property.name.substring(6);

						el.setup.add(
							b.createClassHelper(className, this.compileExpression(property.value, progress, true))
						);

					} else {
						el.setup.add(
							b.createWatch(
								this.compileExpression(property.value, progress, true),
								(watcher) => watcher.update.add(`parent.${hyphensToCamelCase(property.name)} = value;`)
							)
						);
					}
				});

				forEach(element.exports, (exp: _.ASTHTMLNodeTextAttribute) => {
					if (exp.value !== '' && exp.value !== '$this') {
						throw Error(`Can not export "${exp.value}" into "${exp.name}"`);
					}

					el.setup.add(
						b.createSetParameter(hyphensToCamelCase(exp.name), 'parent')
					);
				});

				forEach(element.attributes, (attribute: _.ASTHTMLNodeAttribute) => {
					if (attribute instanceof _.ASTHTMLNodeExpressionAttribute) {
						el.setAttribute(attribute.name, '');
						el.setup.add(
							b.createWatch(
								this.compileExpression(attribute.value, progress, true),
								(watcher) => watcher.update.add(`parent.setAttribute("${attribute.name}", value);`)
							)
						);

					} else {
						el.setAttribute(attribute.name, attribute.value);
					}
				});

				this.processTree(builder, el.setup, progress, matcher, element);

				this.plugins.onAfterProcessElement(element, {
					progress: progress,
					engine: this,
					matcher: matcher,
				});
			})
		);
	}


	private processElementInclude(builder: b.TemplateBuilder, parent: b.BuilderNodesContainer<b.BuilderNodeInterface>, progress: EngineProgress, element: _.ASTHTMLNodeElement, insertBefore: boolean = false): void
	{
		parent.add(
			b.createAddComment('slicky-import', !insertBefore, (comment: b.BuilderAddComment) => {
				let selector: string = '';
				let setParameters: Array<_.ASTHTMLNodeTextAttribute> = [];

				forEach(element.attributes, (attribute: _.ASTHTMLNodeTextAttribute) => {
					if (attribute.name === 'selector') {
						selector = attribute.value;
					} else {
						setParameters.push(attribute);
					}
				});

				// todo: check selector

				let template = builder.findTemplate(selector);

				// todo: check template

				comment.setup.add(
					b.createImportTemplate(template.id, [], (templateImport) => {
						forEach(setParameters, (parameter: _.ASTHTMLNodeTextAttribute) => {
							templateImport.factorySetup.add(
								b.createSetParameter(hyphensToCamelCase(parameter.name), `"${parameter.value}"`)
							);
						});

						forEach(element.properties, (property: _.ASTHTMLNodeExpressionAttribute) => {
							templateImport.factorySetup.add(
								b.createSetParameter(hyphensToCamelCase(property.name), this.compileExpression(property.value, progress))
							);
						});

						// todo: check whether all injects were injected
					})
				);
			})
		);
	}


	private processElementTemplate(builder: b.TemplateBuilder, parent: b.BuilderNodesContainer<b.BuilderNodeInterface>, progress: EngineProgress, matcher: Matcher, element: _.ASTHTMLNodeElement): void
	{
		let injectAttribute: _.ASTHTMLNodeTextAttribute = find(element.attributes, (attribute: _.ASTHTMLNodeTextAttribute) => {
			return attribute.name === 'inject';
		});

		let inject = injectAttribute ? map(injectAttribute.value.split(','), (param: string) => param.trim()) : [];

		let innerProgress = progress.fork();
		innerProgress.localVariables = merge(innerProgress.localVariables, inject);
		innerProgress.inTemplate = true;

		builder.addTemplate(element, (template) => {
			parent.add(
				b.createAddComment('slicky-template', true, (comment) => {
					this.plugins.onProcessTemplate({
						element: element,
						template: template,
						comment: comment,
						progress: innerProgress,
						engine: this,
					});
				})
			);

			this.processTree(builder, template.body, innerProgress, matcher, element, true);
		});
	}


	public compileExpression(expr: string, progress: EngineProgress, addMissingReturn: boolean = false): string
	{
		let parser = new tjs.Parser(new tjs.Tokenizer(new InputStream(expr)), {
			addMissingReturn: addMissingReturn,
			variableHook: (identifier: tjs.ASTIdentifier, declaration: tjs.ParserVariableDeclaration) => {
				if (declaration === tjs.ParserVariableDeclaration.FunctionArgument) {
					return identifier;
				}

				if (identifier.name === '$event') {
					return identifier;
				}

				if (identifier.name === '$this') {
					return new tjs.ASTIdentifier('parent');
				}

				let call = new tjs.ASTCallExpression(
					new tjs.ASTMemberExpression(
						new tjs.ASTIdentifier('tmpl'),
						new tjs.ASTIdentifier('getParameter')
					),
					[
						new tjs.ASTStringLiteral(identifier.name),
					]
				);

				return this.plugins.onExpressionVariableHook(call, {
					declaration: declaration,
					progress: progress,
					engine: this,
				});
			},
			filterExpressionHook: (filter: tjs.ASTFilterExpression) => {
				return new tjs.ASTCallExpression(
					new tjs.ASTMemberExpression(
						new tjs.ASTIdentifier('tmpl'),
						new tjs.ASTIdentifier('callFilter')
					),
					[
						new tjs.ASTStringLiteral(filter.name.name),
						filter.modify,
						new tjs.ASTArrayExpression(filter.arguments),
					]
				);
			},
		});

		return parser.parse().render();
	}

}
