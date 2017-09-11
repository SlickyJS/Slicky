import {indent, map} from '@slicky/utils';


export class CSSNodeRule
{


	public selectors: Array<CSSNodeSelector>;

	public declarations: Array<CSSNodeDeclaration>;


	constructor(selectors: Array<CSSNodeSelector>, declarations: Array<CSSNodeDeclaration> = [])
	{
		this.selectors = selectors;
		this.declarations = declarations;
	}


	public render(): string
	{
		if (!this.declarations.length) {
			return '';
		}

		const selectors = map(this.selectors, (selector: CSSNodeSelector) => {
			return selector.render();
		});

		const declarations = map(this.declarations, (rule: CSSNodeDeclaration) => {
			return rule.render();
		});

		return (
			`${selectors.join(', ')} {\n` +
			`${indent(declarations.join('\n'))}\n` +
			`}`
		);
	}

}


export class CSSNodeSelector
{


	public value: string;


	constructor(value: string)
	{
		this.value = value;
	}


	public render(): string
	{
		return this.value;
	}

}


export class CSSNodeDeclaration
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
