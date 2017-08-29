import {TemplateSetup} from '@slicky/templates';
import {indent} from '@slicky/utils';
import {DirectiveDefinitionType} from '@slicky/core';


export class TemplateSetupDirective extends TemplateSetup
{


	public hash: number;

	public type: DirectiveDefinitionType;


	constructor(hash: number, type: DirectiveDefinitionType)
	{
		super();

		this.hash = hash;
		this.type = type;
	}


	public render(): string
	{
		let init = this.type === DirectiveDefinitionType.Directive ?
			`root.getProvider("directivesProvider").create(${this.hash}, parent, root.getProvider("container"), function(directive) {` :
			`root.getProvider("templatesProvider").createFrom(${this.hash}, parent, tmpl, function(tmpl, directive) {`
		;

		return (
			`${init}\n` +
			`${indent(this.renderSetup())}\n` +
			`});`
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
			`directive.${this.output}.subscribe(function($value) {\n` +
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
		return (
			`tmpl.run(function() {\n` +
			`	directive.onInit();\n` +
			`});`
		);
	}

}


export class TemplateSetupTemplateOnDestroy extends TemplateSetup
{


	public code: string;

	public callParent: boolean;		// todo: remove


	constructor(code: string, callParent: boolean = false)
	{
		super();

		this.code = code;
		this.callParent = callParent;
	}


	public render(): string
	{
		let callee = this.callParent ? '.parent' : '';

		return (
			`tmpl${callee}.onDestroy(function() {\n` +
			`${indent(this.code)}\n` +
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


export class TemplateSetupDirectivePropertyWrite extends TemplateSetup
{


	public property: string;

	public value: string;

	public rootComponent: boolean;


	constructor(property: string, value: string, rootComponent: boolean = false)
	{
		super();

		this.property = property;
		this.value = value;
		this.rootComponent = rootComponent;
	}


	public render(): string
	{
		let target = this.rootComponent ? 'root.getProvider("component")' : 'directive';

		return `${target}.${this.property} = ${this.value};`;
	}

}


export class TemplateSetupDirectiveMethodCall extends TemplateSetup
{


	public method: string;

	public args: string;

	public rootComponent: boolean;


	constructor(method: string, args: string, rootComponent: boolean = false)
	{
		super();

		this.method = method;
		this.args = args;
		this.rootComponent = rootComponent;
	}


	public render(): string
	{
		let target = this.rootComponent ? 'root.getProvider("component")' : 'directive';

		return `${target}.${this.method}(${this.args});`;
	}

}
