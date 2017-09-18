import {map, indent, isFunction, isString, filter, forEach} from '@slicky/utils';


export interface BuilderNodeInterface
{


	render(): string;

}


export class BuilderNodesContainer<T extends BuilderNodeInterface> implements BuilderNodeInterface
{


	public delimiter: string;

	private nodes: Array<T>;


	constructor(nodes: Array<T> = [], delimiter: string = '\n')
	{
		this.nodes = nodes;
		this.delimiter = delimiter;
	}


	public add(node: T|string): void
	{
		if (isString(node)) {
			node = <any>createCode(<string>node);
		}

		this.nodes.push(<T>node);
	}


	public append(container: BuilderNodesContainer<T>): void
	{
		forEach(container.nodes, (node) => {
			this.add(node);
		});
	}


	public replace(container: BuilderNodesContainer<T>): void
	{
		this.nodes = container.nodes;
	}


	public isEmpty(): boolean
	{
		return this.nodes.length === 0;
	}


	public render(): string
	{
		return map(this.nodes, (node: BuilderNodeInterface) => node.render()).join(this.delimiter);
	}

}


/***************** CODE *****************/


export function createCode(code: string): BuilderCode
{
	return new BuilderCode(code);
}

export class BuilderCode implements BuilderNodeInterface
{


	public code: string;


	constructor(code: string)
	{
		this.code = code;
	}


	public render(): string
	{
		return this.code;
	}

}


/***************** FUNCTION *****************/


export function createFunction(name: string = null, args: Array<string> = [], setup: (fn: BuilderFunction) => void = null): BuilderFunction
{
	let fn = new BuilderFunction(name, args);

	if (isFunction(setup)) {
		setup(fn);
	}

	return fn;
}

export class BuilderFunction implements BuilderNodeInterface
{


	public name: string;

	public args: Array<string>;

	public beginning = new BuilderNodesContainer;

	public body = new BuilderNodesContainer;

	public end = new BuilderNodesContainer;


	constructor(name: string = null, args: Array<string> = [])
	{
		this.name = name;
		this.args = args;
	}


	public render(): string
	{
		let name = this.name === null ? '' : ` ${this.name}`;
		let firstListDelimiter = this.name === null ? ' ' : '\n';

		const body = filter([
			this.beginning.render(),
			this.body.render(),
			this.end.render(),
		], (code) => {
			return code !== '';
		});

		return (
			`function${name}(${this.args.join(', ')})${firstListDelimiter}` +
			`{\n` +
			`${indent(body.join('\n'))}\n` +
			`}`
		);
	}

}
