import {isFunction, indent, forEach, find, exists} from '@slicky/utils';
import {Matcher} from '@slicky/query-selector';
import * as _ from '@slicky/html-parser';
import * as t from './nodes';


declare interface TemplateBuffer
{
	id: number;
	element: _.ASTHTMLNodeElement;
	method: t.TemplateMethodTemplate;
}


export class TemplateBuilder
{


	private className: string;

	private matcher: Matcher;

	private templatesCount: number = 0;

	private templates: Array<TemplateBuffer> = [];

	private methods: {[name: string]: t.TemplateMethod} = {};


	constructor(className: string, matcher: Matcher)
	{
		this.className = className;
		this.matcher = matcher;
		this.methods['main'] = new t.TemplateMethod(this.className, 'main');
	}


	public getMainMethod(): t.TemplateMethod
	{
		return this.methods['main'];
	}


	public addTemplate(element: _.ASTHTMLNodeElement, fn: (template: t.TemplateMethodTemplate) => void = null): void
	{
		let id = this.templatesCount++;
		let name = `template${id}`;

		let template = new t.TemplateMethodTemplate(this.className, name, id);

		if (isFunction(fn)) {
			fn(template);
		}

		this.templates.push({
			id: id,
			element: element,
			method: template,
		});

		this.methods[name] = template;
	}


	public findTemplate(selector: string): t.TemplateMethodTemplate
	{
		let template: TemplateBuffer = find(this.templates, (template: TemplateBuffer) => {
			return this.matcher.matches(template.element, selector);
		});

		return exists(template) ? template.method : undefined;
	}


	public render(): string
	{
		return (
			`return function(_super)\n` +
			`{\n` +
			`	_super.childTemplateExtend(Template${this.className});\n` +
			`	function Template${this.className}(application, parent)\n` +
			`	{\n` +
			`		_super.call(this, application, parent);\n` +
			`	}\n` +
			`${indent(this.renderMethods())}\n` +
			`	return Template${this.className};\n` +
			`}`
		);
	}


	private renderMethods(): string
	{
		let methods = [];

		forEach(this.methods, (method: t.TemplateMethod) => {
			methods.push(method.render());
		});

		return methods.join('\n');
	}

}
