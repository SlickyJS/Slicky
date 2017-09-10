import {indent, map} from '@slicky/utils';


export class CSSNodeSelector
{


	public selector: string;

	public rules: Array<CSSNodeRule>;


	constructor(selector: string, rules: Array<CSSNodeRule> = [])
	{
		this.selector = selector;
		this.rules = rules;
	}


	public render(): string
	{
		if (!this.rules.length) {
			return '';
		}

		const rules = map(this.rules, (rule: CSSNodeRule) => {
			return rule.render();
		});

		return (
			`${this.selector} {\n` +
			`${indent(rules.join('\n'))}\n` +
			`}`
		);
	}

}


export class CSSNodeRule
{


	public name: string;

	public value: string;

	public important: boolean;


	constructor(name: string, value: string, important: boolean = false)
	{
		this.name = name;
		this.value = value;
		this.important = important;
	}


	public render(): string
	{
		return `${this.name}: ${this.value}${this.important ? ' !important' : ''};`;
	}

}
