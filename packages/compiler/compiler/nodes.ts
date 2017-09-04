import * as b from '@slicky/templates/builder';
import {DirectiveDefinitionType} from '@slicky/core/metadata';
import {indent, isFunction} from '@slicky/utils';


/***************** COMPONENT SET HOST_ELEMENT *****************/


export function createComponentSetHostElement(property: string): BuilderComponentSetHostElement
{
	return new BuilderComponentSetHostElement(property);
}

export class BuilderComponentSetHostElement implements b.BuilderNodeInterface
{


	public property: string;


	constructor(property: string)
	{
		this.property = property;
	}


	public render(): string
	{
		return `root.getProvider("component").${this.property} = parent;`;
	}

}


/***************** CREATE DIRECTIVE *****************/


export function createCreateDirective(hash: number, type: DirectiveDefinitionType, setup: (createDirective: BuilderCreateDirective) => void = null): BuilderCreateDirective
{
	let node = new BuilderCreateDirective(hash, type);

	if (isFunction(setup)) {
		setup(node);
	}

	return node;
}

export class BuilderCreateDirective implements b.BuilderNodeInterface
{


	public hash: number;

	public type: DirectiveDefinitionType;

	public setup: b.BuilderNodesContainer<b.BuilderNodeInterface> = new b.BuilderNodesContainer;


	constructor(hash: number, type: DirectiveDefinitionType)
	{
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
			`${indent(this.setup.render())}\n` +
			`});`
		);
	}

}


/***************** DIRECTIVE PROPERTY WRITE *****************/


export function createDirectivePropertyWrite(property: string, value: string, rootComponent: boolean = false): BuilderDirectivePropertyWrite
{
	return new BuilderDirectivePropertyWrite(property, value, rootComponent);
}

export class BuilderDirectivePropertyWrite implements b.BuilderNodeInterface
{


	public property: string;

	public value: string;

	public rootComponent: boolean;


	constructor(property: string, value: string, rootComponent: boolean = false)
	{
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


/***************** DIRECTIVE METHOD CALL *****************/


export function createDirectiveMethodCall(method: string, args: Array<string> = [], rootComponent: boolean = false): BuilderDirectiveMethodCall
{
	return new BuilderDirectiveMethodCall(method, args, rootComponent);
}

export class BuilderDirectiveMethodCall implements b.BuilderNodeInterface
{


	public method: string;

	public args: Array<string>;

	public rootComponent: boolean;


	constructor(method: string, args: Array<string> = [], rootComponent: boolean = false)
	{
		this.method = method;
		this.args = args;
		this.rootComponent = rootComponent;
	}


	public render(): string
	{
		let target = this.rootComponent ? 'root.getProvider("component")' : 'directive';

		return `${target}.${this.method}(${this.args.join(', ')});`;
	}

}


/***************** DIRECTIVE OUTPUT *****************/


export function createDirectiveOutput(output: string, call: string): BuilderDirectiveOutput
{
	return new BuilderDirectiveOutput(output, call);
}

export class BuilderDirectiveOutput implements b.BuilderNodeInterface
{


	public output: string;

	public call: string;


	constructor(output: string, call: string)
	{
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


/***************** DIRECTIVE ON INIT *****************/


export function createDirectiveOnInit(): BuilderDirectiveOnInit
{
	return new BuilderDirectiveOnInit;
}

export class BuilderDirectiveOnInit implements b.BuilderNodeInterface
{


	public render(): string
	{
		return b.createMethodCall(
			b.createIdentifier('tmpl'),
			'run',
			[
				b.createFunction(
					null,
					[],
					(fn) => {
						fn.body.add('directive.onInit();')
					}
				),
			]
		).render() + ';';
	}

}


/***************** COMPONENT RENDER *****************/


export function createComponentRender(): BuilderComponentRender
{
	return new BuilderComponentRender;
}

export class BuilderComponentRender implements b.BuilderNodeInterface
{


	public render(): string
	{
		return 'tmpl.render(parent);';
	}

}
