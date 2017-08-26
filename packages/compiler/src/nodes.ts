import {TemplateSetup} from '@slicky/templates';
import {indent} from '@slicky/utils';


export class TemplateSetupComponent extends TemplateSetup
{


	public hash: number;


	constructor(hash: number)
	{
		super();

		this.hash = hash;
	}


	public render(): string
	{
		return (
			`(function(tmpl) {\n` +
			`	var tmpl = root.getProvider("templatesProvider").createFrom(${this.hash}, tmpl);\n` +
			`${indent(this.renderSetup())}\n` +
			`})(tmpl);`
		);
	}

}


export class TemplateSetupComponentRender extends TemplateSetup
{


	public render(): string
	{
		return `tmpl.render(parent);`;
	}

}


export class TemplateSetupDirectiveOutput extends TemplateSetup
{


	public output: string;

	public call: string;


	constructor(output: string, call: string)
	{
		super();

		this.output = output;
		this.call = call;
	}


	public render(): string
	{
		return (
			`tmpl.getProvider("component").${this.output}.subscribe(function($value) {\n` +
			`	root.run(function() {\n` +
			`		${this.call};\n` +
			`	});\n` +
			`});`
		);
	}

}


export class TemplateSetupDirectiveOnInit extends TemplateSetup
{


	public render(): string
	{
		return `tmpl.getProvider("component").onInit();`;
	}

}


export class TemplateSetupDirectiveOnDestroy extends TemplateSetup
{


	public render(): string
	{
		return (
			`tmpl.parent.onDestroy(function() {\n` +
			`	tmpl.getProvider("component").onDestroy();\n` +
			`});`
		);
	}

}


export class TemplateSetupComponentHostElement extends TemplateSetup
{


	public property: string;


	constructor(property: string)
	{
		super();

		this.property = property;
	}


	public render(): string
	{
		return `root.getProvider("component").${this.property} = parent;`;
	}

}
