import {find, exists} from '@slicky/utils';
import {Matcher} from '@slicky/query-selector';
import * as _ from '@slicky/html-parser';
import * as b from './nodes';


declare interface TemplateBuffer
{
	id: number;
	element: _.ASTHTMLNodeElement;
	method: b.BuilderTemplateMethod;
}


export class TemplateBuilder
{


	private templateClass: b.BuilderClass;

	private templateMainMethod: b.BuilderMethod;

	private matcher: Matcher;

	private templatesCount: number = 0;

	private templates: Array<TemplateBuffer> = [];


	constructor(className: string, matcher: Matcher)
	{
		this.matcher = matcher;
		this.templateClass = b.createClass(`Template${className}`, ['application', 'parent'], (cls) => {
			cls.beforeClass.add('_super.childTemplateExtend({{ className }});');
			cls.afterClass.add('return {{ className }};');
			cls.body.add('_super.call(this, application, parent);');

			this.templateMainMethod = b.createMethod(cls, 'main', ['parent'], (main) => {
				main.body.add('var root = this;');
				main.body.add('var tmpl = this;');

				main.end.add('tmpl.init();');
			});

			cls.methods.add(this.templateMainMethod);
		});
	}


	public getMainMethod(): b.BuilderMethod
	{
		return this.templateMainMethod;
	}


	public addTemplate(element: _.ASTHTMLNodeElement, setup: (method: b.BuilderTemplateMethod) => void = null): void
	{
		let id = this.templatesCount++;
		let template = b.createTemplateMethod(this.templateClass, id, setup);

		this.templateClass.methods.add(template);

		this.templates.push({
			id: id,
			element: element,
			method: template,
		});
	}


	public findTemplate(selector: string): b.BuilderTemplateMethod
	{
		let template: TemplateBuffer = find(this.templates, (template: TemplateBuffer) => {
			return this.matcher.matches(template.element, selector);
		});

		return exists(template) ? template.method : undefined;
	}


	public render(): string
	{
		return b.createReturn(b.createFunction(null, ['_super'], (fn) => {
			fn.body.add(this.templateClass);
		})).render();
	}

}
