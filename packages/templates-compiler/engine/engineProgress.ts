import {clone, find} from '@slicky/utils';
import {Matcher} from '@slicky/query-selector';
import * as _ from '@slicky/html-parser';


export declare interface EngineProgressTemplate
{
	id: number;
	name: string;
	element: _.ASTHTMLNodeElement;
}


export class EngineProgress
{


	public localVariables: Array<string> = [];

	public inTemplate: boolean = false;

	protected templatesCount: number = 0;

	private templates: Array<EngineProgressTemplate> = [];

	private root: EngineProgress;


	constructor()
	{
		this.root = this;
	}


	public fork(): EngineProgress
	{
		let inner = new EngineProgress;

		inner.root = this.root;
		inner.localVariables = clone(this.localVariables);
		inner.templates = clone(this.templates);
		inner.inTemplate = this.inTemplate;

		return inner;
	}


	public addTemplate(element: _.ASTHTMLNodeElement): EngineProgressTemplate
	{
		const id = this.root.templatesCount++;

		const template: EngineProgressTemplate = {
			id: id,
			name: `@template_${id}`,
			element: element,
		};

		this.templates.push(template);

		return template;
	}


	public findTemplateBySelector(matcher: Matcher, selector: string): EngineProgressTemplate
	{
		return find(this.templates, (template: EngineProgressTemplate) => {
			return matcher.matches(template.element, selector);
		});
	}

}
