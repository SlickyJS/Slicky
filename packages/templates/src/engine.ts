import {Matcher} from '@slicky/query-selector';
import {forEach, map, hyphensToCamelCase, find, merge} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import {InputStream} from '@slicky/tokenizer';
import {EventEmitter} from '@slicky/event-emitter';
import {DocumentWalker} from './querySelector';
import {EnginePluginManager} from './enginePluginManager';
import {EnginePlugin} from './enginePlugin';
import {IfEnginePlugin, ForEnginePlugin} from './default';
import {EngineProgress} from './engineProgress';
import * as t from './builder';


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
		let builder = new t.TemplateBuilder(name + '', matcher);
		let tree = (new _.HTMLParser(template)).parse();

		this.processTree(builder, builder.getMainMethod(), progress, matcher, tree);

		let code = builder.render();

		this.compiled.emit({
			name: name,
			code: code,
		});

		return code;
	}


	private processTree(builder: t.TemplateBuilder, builderParent: t.TemplateNodeParent, progress: EngineProgress, matcher: Matcher, parent: _.ASTHTMLNodeParent, insertBefore: boolean = false): void
	{
		forEach(parent.childNodes, (child: _.ASTHTMLNode) => {
			if (child instanceof _.ASTHTMLNodeElement) {
				this.processElement(builder, builderParent, progress, matcher, child, insertBefore);

			} else if (child instanceof _.ASTHTMLNodeExpression) {
				this.processExpression(builderParent, progress, child, insertBefore);

			} else if (child instanceof _.ASTHTMLNodeText) {
				this.processText(builderParent, child, insertBefore);
			}
		});
	}


	private processExpression(parent: t.TemplateNodeParent, progress: EngineProgress, expression: _.ASTHTMLNodeExpression, insertBefore: boolean = false): void
	{
		parent.addText('', insertBefore, (text) => {
			text.addSetupWatch(this.compileExpression(expression.value, progress, true), 'text.nodeValue = value');
		});
	}


	private processText(parent: t.TemplateNodeParent, text: _.ASTHTMLNodeText, insertBefore: boolean = false): void
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

		parent.addText(value, insertBefore);
	}


	private processElement(builder: t.TemplateBuilder, parent: t.TemplateNodeParent, progress: EngineProgress, matcher: Matcher, element: _.ASTHTMLNodeElement, insertBefore: boolean = false): void
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

		parent.addElement(element.name, insertBefore, (el: t.TemplateNodeElement) => {
			this.plugins.onProcessElement(element, {
				element: el,
				progress: progress,
				matcher: matcher,
				engine: this,
			});

			forEach(element.events, (event: _.ASTHTMLNodeExpressionAttributeEvent) => {
				el.addSetupAddEventListener(event.name, this.compileExpression(event.value, progress), event.preventDefault);
			});

			forEach(element.properties, (property: _.ASTHTMLNodeExpressionAttribute) => {
				// todo: check if property is valid html property

				el.addSetupWatch(this.compileExpression(property.value, progress, true), `parent.${hyphensToCamelCase(property.name)} = value`);
			});

			forEach(element.exports, (exp: _.ASTHTMLNodeTextAttribute) => {
				if (exp.value !== '' && exp.value !== '$this') {
					throw Error(`Can not export "${exp.value}" into "${exp.name}"`);
				}

				el.addSetupParameterSet(hyphensToCamelCase(exp.name), 'parent');
			});

			forEach(element.attributes, (attribute: _.ASTHTMLNodeAttribute) => {
				if (attribute instanceof _.ASTHTMLNodeExpressionAttribute) {
					el.setAttribute(attribute.name, '');
					el.addSetupWatch(this.compileExpression(attribute.value, progress, true), `parent.setAttribute("${attribute.name}", value)`);

				} else {
					el.setAttribute(attribute.name, attribute.value);
				}
			});

			this.processTree(builder, el, progress, matcher, element);
		});
	}


	private processElementInclude(builder: t.TemplateBuilder, parent: t.TemplateNodeParent, progress: EngineProgress, element: _.ASTHTMLNodeElement, insertBefore: boolean = false): void
	{
		parent.addComment('slicky-import', insertBefore, (comment: t.TemplateNodeComment) => {
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

			comment.addSetupImportTemplate(template.id, (templateImport: t.TemplateSetupImportTemplate) => {
				forEach(setParameters, (parameter: _.ASTHTMLNodeTextAttribute) => {
					templateImport.addSetupParameterSet(hyphensToCamelCase(parameter.name), `"${parameter.value}"`);
				});

				forEach(element.properties, (property: _.ASTHTMLNodeExpressionAttribute) => {
					templateImport.addSetupParameterSet(hyphensToCamelCase(property.name), this.compileExpression(property.value, progress));
				});

				// todo: check whether all injects were injected
			});
		});
	}


	private processElementTemplate(builder: t.TemplateBuilder, parent: t.TemplateNodeParent, progress: EngineProgress, matcher: Matcher, element: _.ASTHTMLNodeElement): void
	{
		let injectAttribute: _.ASTHTMLNodeTextAttribute = find(element.attributes, (attribute: _.ASTHTMLNodeTextAttribute) => {
			return attribute.name === 'inject';
		});

		let inject = injectAttribute ? map(injectAttribute.value.split(','), (param: string) => param.trim()) : [];

		let innerProgress = progress.fork();
		innerProgress.localVariables = merge(innerProgress.localVariables, inject);
		innerProgress.inTemplate = true;

		return builder.addTemplate(element, (template: t.TemplateMethodTemplate) => {
			parent.addComment(`slicky-template-${template.id}`, false, (comment: t.TemplateNodeComment) => {
				this.plugins.onProcessTemplate({
					element: element,
					template: template,
					comment: comment,
					progress: innerProgress,
					engine: this,
				});
			});

			this.processTree(builder, template, innerProgress, matcher, element, true);
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
