import {Matcher} from '@slicky/query-selector';
import {forEach, map, hyphensToCamelCase, find, merge, startsWith, exists, indent} from '@slicky/utils';
import * as _ from '@slicky/html-parser';
import * as tjs from '@slicky/tiny-js';
import {InputStream} from '@slicky/tokenizer';
import {EventEmitter} from '@slicky/event-emitter';
import {TemplateEncapsulation} from '@slicky/templates/templates';
import {DocumentWalker} from '../querySelector';
import {EnginePluginManager} from './enginePluginManager';
import {EnginePlugin} from './enginePlugin';
import {StylesPlugin, ConditionPlugin, LoopPlugin, TwoWayBindingPlugin} from '../plugins';
import {EngineProgress} from './engineProgress';
import * as b from '../builder';


export class EngineCompileOptions
{
	name?: string;		// todo: remove
	encapsulation?: TemplateEncapsulation;
	styles?: Array<string>;
}


export class Engine
{


	public compiled = new EventEmitter<{name: string|number, code: string}>();	// todo: remove

	private plugins: EnginePluginManager;


	constructor()
	{
		this.plugins = new EnginePluginManager;

		this.addPlugin(new StylesPlugin);
		this.addPlugin(new ConditionPlugin);
		this.addPlugin(new LoopPlugin);
		this.addPlugin(new TwoWayBindingPlugin);
	}


	public addPlugin(plugin: EnginePlugin): void
	{
		this.plugins.register(plugin);
	}


	public compile(template: string, options: EngineCompileOptions = {}): string
	{
		if (!exists(options.styles)) {
			options.styles = [];
		}

		if (!exists(options.encapsulation)) {
			options.encapsulation = TemplateEncapsulation.Emulated;
		}

		const progress = new EngineProgress;
		const matcher = new Matcher(new DocumentWalker);
		const builder = new b.TemplateBuilder(matcher);
		const tree = (new _.HTMLParser(template)).parse();

		const render = builder.getRenderFunction();

		this.plugins.onBeforeCompile({
			progress: progress,
			engine: this,
			options: options,
			render: render,
		});

		this._processTree(render, progress, matcher, tree);

		this.plugins.onAfterCompile({
			progress: progress,
			engine: this,
			options: options,
			render: render,
		});

		const code = builder.render();

		this.compiled.emit({
			name: options.name,
			code: code,
		});

		return code;
	}


	public _processTree(render: b.BuilderFunction, progress: EngineProgress, matcher: Matcher, parent: _.ASTHTMLNodeParent): void
	{
		forEach(parent.childNodes, (child: _.ASTHTMLNode) => {
			if (child instanceof _.ASTHTMLNodeElement) {
				this.processElement(progress, matcher, render, child);

			} else if (child instanceof _.ASTHTMLNodeExpression) {
				this.processExpression(progress, render, child);

			} else if (child instanceof _.ASTHTMLNodeText) {
				this.processText(render, child);
			}
		});
	}


	public _compileExpression(expr: string, progress: EngineProgress, addMissingReturn: boolean = false, parametersFromOuterTemplate: boolean = false): string
	{
		let parser = new tjs.Parser(new tjs.Tokenizer(new InputStream(expr)), {
			addMissingReturn: addMissingReturn,
			variableHook: (identifier: tjs.ASTIdentifier, declaration: tjs.ParserVariableDeclaration) => {
				if (declaration === tjs.ParserVariableDeclaration.FunctionArgument) {
					return identifier;
				}

				if (identifier.name === '$event' || identifier.name === '$iterator') {
					return identifier;
				}

				if (identifier.name === '$this') {
					return new tjs.ASTMemberExpression(
						new tjs.ASTIdentifier('el'),
						new tjs.ASTIdentifier('_nativeNode')
					);
				}

				const templateName = parametersFromOuterTemplate ? 'outer' : 'template';

				let call = new tjs.ASTCallExpression(
					new tjs.ASTMemberExpression(
						new tjs.ASTIdentifier(templateName),
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
						new tjs.ASTIdentifier('template'),
						new tjs.ASTIdentifier('filter')
					),
					[
						new tjs.ASTStringLiteral(filter.name.name),
						filter.modify,
					].concat(filter.arguments)
				);
			},
		});

		return parser.parse().render();
	}


	private processText(render: b.BuilderFunction, text: _.ASTHTMLNodeText): void
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

		render.body.add(`el.addText("${value}");`);
	}


	private processExpression(progress: EngineProgress, render: b.BuilderFunction, expression: _.ASTHTMLNodeExpression): void
	{
		render.body.add(
			`el.addExpression(function() {\n` +
			`	${this._compileExpression(expression.value, progress, true)};\n` +
			`});`
		);
	}


	private processElement(progress: EngineProgress, matcher: Matcher, render: b.BuilderFunction, element: _.ASTHTMLNodeElement): void
	{
		let stopProcessing = false;

		element = this.plugins.onBeforeProcessElement(element, {
			progress: progress,
			matcher: matcher,
			engine: this,
			stopProcessing: () => {
				stopProcessing = true;
			},
		});

		if (stopProcessing) {
			return;
		}

		if (element.name === 'template') {
			return this.processElementTemplate(progress, matcher, render, element);
		}

		if (element.name === 'include') {
			return this.processElementInclude(progress, matcher, render, element);
		}

		const attributes = [];
		const elementSetup = b.createFunction(null, ['el']);

		this.plugins.onProcessElement(element, {
			progress: progress,
			matcher: matcher,
			engine: this,
			render: elementSetup,
		});

		forEach(element.attributes, (attribute: _.ASTHTMLNodeAttribute) => {
			if (attribute instanceof _.ASTHTMLNodeExpressionAttribute) {
				attributes.push(`"${attribute.name}": ""`);

				elementSetup.body.add(
					`el.setDynamicAttribute("${attribute.name}", function() {\n` +
					`	${this._compileExpression(attribute.value, progress, true)};\n` +
					`});`
				);

			} else {
				attributes.push(`"${attribute.name}": "${attribute.value}"`);
			}
		});

		forEach(element.properties, (property: _.ASTHTMLNodeExpressionAttribute) => {
			if (startsWith(property.name, 'class.')) {
				const className = property.name.split('.')[1];

				elementSetup.body.add(
					`el.addDynamicClass("${className}", function() {\n` +
					`	${this._compileExpression(property.value, progress, true)};\n` +
					`});`
				);

			} else {
				elementSetup.body.add(
					`template.watch(function() {\n` +
					`	${this._compileExpression(property.value, progress, true)};\n` +
					`}, function(value) {\n` +
					`	el._nativeNode.${hyphensToCamelCase(property.name)} = value;\n` +
					`});`
				);
			}
		});

		forEach(element.events, (event: _.ASTHTMLNodeExpressionAttributeEvent) => {
			const code = [];

			if (event.preventDefault) {
				code.push('$event.preventDefault();');
			}

			code.push(this._compileExpression(event.value, progress, true) + ';');

			elementSetup.body.add(
				`el.addEvent("${event.name}", function($event) {\n` +
				`${indent(code.join('\n'))}\n` +
				`});`
			);
		});

		forEach(element.exports, (exportAttr: _.ASTHTMLNodeAttribute) => {
			const exportType = exportAttr.value === '' ? '$this' : exportAttr.value;

			elementSetup.body.add(
				`template.setParameter("${hyphensToCamelCase(exportAttr.name)}", ${this._compileExpression(exportType, progress)});`
			);
		});

		this._processTree(elementSetup, progress, matcher, element);

		this.plugins.onAfterProcessElement(element, {
			progress: progress,
			matcher: matcher,
			engine: this,
			render: elementSetup,
		});

		const elementArguments = [`"${element.name}"`];

		if (attributes.length) {
			elementArguments.push(`{${attributes.join(', ')}}`);
		}

		if (!elementSetup.body.isEmpty()) {
			if (!attributes.length) {
				elementArguments.push('{}');
			}

			elementArguments.push(elementSetup.render());
		}

		render.body.add(`el.addElement(${elementArguments.join(', ')});`);
	}


	private processElementTemplate(progress: EngineProgress, matcher: Matcher, render: b.BuilderFunction, element: _.ASTHTMLNodeElement): void
	{
		const injectAttribute: _.ASTHTMLNodeTextAttribute = find(element.attributes, (attribute: _.ASTHTMLNodeTextAttribute) => {
			return attribute.name === 'inject';
		});

		const inject = injectAttribute ? map(injectAttribute.value.split(','), (param: string) => param.trim()) : [];

		const innerProgress = progress.fork();
		const template = progress.addTemplate(element);

		innerProgress.localVariables = merge(innerProgress.localVariables, inject);
		innerProgress.inTemplate = true;

		const renderTemplate = b.createFunction(null, ['template', 'el']);
		const renderAfter = b.createFunction(null, []);

		this.plugins.onProcessTemplate({
			element: element,
			template: template,
			progress: innerProgress,
			engine: this,
			render: renderAfter,
			renderTemplate: renderTemplate,
		});

		this._processTree(renderTemplate, innerProgress, matcher, element);

		render.body.add(
			`template.declareTemplate("${template.name}", ${renderTemplate.render()});`
		);

		render.body.append(renderAfter.body);
	}


	private processElementInclude(progress: EngineProgress, matcher: Matcher, render: b.BuilderFunction, element: _.ASTHTMLNodeElement): void
	{
		const parameters: Array<string> = [];
		let selector: string = '';

		forEach(element.attributes, (attribute: _.ASTHTMLNodeTextAttribute) => {
			if (attribute.name === 'selector') {
				selector = attribute.value;
			} else {
				parameters.push(`"${hyphensToCamelCase(attribute.name)}": "${attribute.value}"`);
			}
		});

		if (selector === '') {
			throw new Error('Element <include> must have the "selector" attribute for specific <template>.');
		}

		const template = progress.findTemplateBySelector(matcher, selector);

		if (!exists(template)) {
			throw new Error(`Element <include> tries to include unknown <template> with "${selector}" selector.`);
		}

		const templateArguments = [
			`"${template.name}"`,
		];

		if (parameters.length) {
			templateArguments.push(`{${parameters.join(', ')}}`);
		}

		const templateSetup = b.createFunction(null, ['template', 'outer']);

		forEach(element.properties, (property: _.ASTHTMLNodeExpressionAttribute) => {
			templateSetup.body.add(
				`outer.watch(function() {\n` +
				`	${this._compileExpression(property.value, progress, true, true)};\n` +
				`}, function(value) {\n` +
				`	template.setParameter("${hyphensToCamelCase(property.name)}", value);\n` +
				`});`
			);
		});

		if (!templateSetup.body.isEmpty()) {
			templateArguments.push(templateSetup.render());
		}

		render.body.add(
			`template.renderTemplate(${templateArguments.join(', ')});`
		);
	}

}
