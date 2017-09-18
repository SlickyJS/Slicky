import {Matcher} from '@slicky/query-selector';
import * as b from './nodes';


export class TemplateBuilder
{


	private matcher: Matcher;

	private renderFunction: b.BuilderFunction;


	constructor(matcher: Matcher)
	{
		this.matcher = matcher;
	}


	public getRenderFunction(): b.BuilderFunction
	{
		if (!this.renderFunction) {
			this.renderFunction = b.createFunction(null, ['template', 'el']);
		}

		return this.renderFunction;
	}


	public render(): string
	{
		return `return ${this.renderFunction.render()}`;
	}

}
