import {isFunction, indent, map, filter, keys, forEach} from '@slicky/utils';


export abstract class TemplateNodeSetupAware
{

	public setup: Array<TemplateSetup> = [];


	public addSetup(setup: TemplateSetup, fn: (setup: TemplateSetup) => void = null): void
	{
		this.setup.push(setup);

		if (isFunction(fn)) {
			fn(setup);
		}
	}


	public addSetupParameterSet(name: string, value: string): void
	{
		this.setup.push(new TemplateSetupParameterSet(name, value));
	}


	public addSetupWatch(watch: string, update: string): void
	{
		this.setup.push(new TemplateSetupWatch(watch, update));
	}


	public addSetupAddEventListener(name: string, callback: string, preventDefault: boolean = false): void
	{
		this.setup.push(new TemplateSetupAddEventListener(name, callback, preventDefault));
	}


	public addSetupIf(id: number, watch: string): void
	{
		this.setup.push(new TemplateSetupIf(id, watch));
	}


	public addSetupForOf(id: number, forOf: string, forItem: string, forIndex: string = null, trackBy: string = null): void
	{
		this.setup.push(new TemplateSetupForOf(id, forOf, forItem, forIndex, trackBy));
	}


	public addSetupImportTemplate(id: number, fn: (importTemplate: TemplateSetupImportTemplate) => void = null): void
	{
		let templateImport = new TemplateSetupImportTemplate(id);
		this.setup.push(templateImport);

		if (isFunction(fn)) {
			fn(templateImport);
		}
	}


	public renderSetup(): string
	{
		return map(this.setup, (line: TemplateSetup) => line.render()).join('\n');
	}

}


export abstract class TemplateSetup extends TemplateNodeSetupAware
{


	public abstract render(): string;

}


export class TemplateSetupParameterSet extends TemplateSetup
{


	public name: string;

	public value: string;


	constructor(name: string, value: string)
	{
		super();

		this.name = name;
		this.value = value;
	}


	public render(): string
	{
		return `tmpl.setParameter("${this.name}", ${this.value});`;
	}

}


export class TemplateSetupAddEventListener extends TemplateSetup
{


	public name: string;

	public callback: string;

	public preventDefault: boolean;


	constructor(name: string, callback: string, preventDefault: boolean = false)
	{
		super();

		this.name = name;
		this.callback = callback;
		this.preventDefault = preventDefault;
	}


	public render(): string
	{
		let setup = [];

		if (this.preventDefault) {
			setup.push(`$event.preventDefault();`);
		}

		setup.push(this.callback);

		return (
			`tmpl._addElementEventListener(parent, "${this.name}", function($event) {\n` +
			`${indent(setup.join('\n'))};\n` +
			`});`
		);
	}

}


export class TemplateSetupWatch extends TemplateSetup
{


	public watch: string;

	public update: string;


	constructor(watch: string, update: string)
	{
		super();

		this.watch = watch;
		this.update = update;
	}


	public render(): string
	{
		return (
			`tmpl.getProvider("watcher").watch(\n` +
			`	function() {\n` +
			`${indent(this.watch, 2)};\n` +
			`	},\n` +
			`	function(value) {\n` +
			`${indent(this.update, 2)};\n` +
			`	}\n` +
			`);`
		);
	}

}


export class TemplateSetupIf extends TemplateSetup
{


	public id: number;

	public watch: string;


	constructor(id: number, watch: string)
	{
		super();

		this.id = id;
		this.watch = watch;
	}


	public render(): string
	{
		return (
			`root._createEmbeddedTemplatesContainer(tmpl, parent, function(tmpl, parent, setup) {\n` +
			`	return root.template${this.id}(tmpl, parent, setup);\n` +
			`}, function(tmpl) {\n` +
			`	tmpl.getProvider("ifHelperFactory")(tmpl, function(helper) {\n` +
			`		tmpl.getProvider("watcher").watch(function() {\n` +
			`			${this.watch};\n` +
			`		}, function(value) {\n` +
			`			helper.check(value);\n` +
			`		});\n` +
			`	});\n` +
			`});`
		);
	}

}


export class TemplateSetupForOf extends TemplateSetup
{


	public id: number;

	public forOf: string;

	public forItem: string;

	public forIndex: string;

	public trackBy: string;


	constructor(id: number, forOf: string, forItem: string, forIndex: string = null, trackBy: string = null)
	{
		super();

		this.id = id;
		this.forOf = forOf;
		this.forItem = forItem;
		this.forIndex = forIndex;
		this.trackBy = trackBy;
	}


	public render(): string
	{
		let forItem = `"${this.forItem}"`;
		let forIndex = this.forIndex ? `"${this.forIndex}"` : 'null';
		let forTrackBy = this.trackBy ? this.trackBy : 'null';

		return (
			`root._createEmbeddedTemplatesContainer(tmpl, parent, function(tmpl, parent, setup) {\n` +
			`	return root.template${this.id}(tmpl, parent, setup);\n` +
			`}, function(tmpl) {\n` +
			`	tmpl.getProvider("forOfHelperFactory")(tmpl, ${forItem}, ${forIndex}, ${forTrackBy}, function(helper) {\n` +
			`		tmpl.getProvider("watcher").watch(function() {\n` +
			`			${this.forOf};\n` +
			`		}, function(value) {\n` +
			`			helper.check(value);\n` +
			`		});\n` +
			`	});\n` +
			`});`
		);
	}

}


export class TemplateSetupImportTemplate extends TemplateSetup
{


	public id: number;


	constructor(id: number)
	{
		super();

		this.id = id;
	}


	public render(): string
	{
		if (!this.setup.length) {
			return `root.template${this.id}(tmpl, parent);`;
		}

		return (
			`root.template${this.id}(tmpl, parent, function(tmpl) {\n` +
			`${indent(this.renderSetup())}\n` +
			`});`
		);
	}

}


export abstract class TemplateNode extends TemplateNodeSetupAware
{


	public parentNode: TemplateNodeParent;


	constructor(parentNode: TemplateNodeParent = null)
	{
		super();

		this.parentNode = parentNode;		// todo: remove
	}


	public abstract render(): string;

}


export abstract class TemplateNodeParent extends TemplateNode
{

	public childNodes: Array<TemplateNode> = [];


	constructor(parentNode: TemplateNodeParent = null)
	{
		super(parentNode);
	}


	public addComment(text: string, insertBefore: boolean = false, fn: (text: TemplateNodeComment) => void = null): void
	{
		let node = new TemplateNodeComment(text, insertBefore);
		this.childNodes.push(node);

		if (isFunction(fn)) {
			fn(node);
		}
	}


	public addText(text: string, insertBefore: boolean = false, fn: (text: TemplateNodeText) => void = null): void
	{
		let node = new TemplateNodeText(text, insertBefore);
		this.childNodes.push(node);

		if (isFunction(fn)) {
			fn(node);
		}
	}


	public addElement(elementName: string, insertBefore: boolean = false, fn: (element: TemplateNodeElement) => void = null): void
	{
		let node = new TemplateNodeElement(elementName, insertBefore);
		this.childNodes.push(node);

		if (isFunction(fn)) {
			fn(node);
		}
	}


	public renderChildNodes(): string
	{
		return map(this.childNodes, (node: TemplateNode) => node.render()).join('\n');
	}

}


export class TemplateMethod extends TemplateNodeParent
{


	public className: string;

	public name: string;


	constructor(className: string, name: string)
	{
		super();

		this.className = className;
		this.name = name;
	}


	public render(): string
	{
		return (
			`Template${this.className}.prototype.${this.name} = function(parent)\n` +
			`{\n` +
			`	var root = this;\n` +
			`	var tmpl = this;\n` +
			`${indent(this.renderChildNodes())}\n` +
			`};`
		);
	}

}


export class TemplateMethodTemplate extends TemplateMethod
{


	public id: number;


	constructor(className: string, name: string, id: number)
	{
		super(className, name);

		this.id = id;
	}


	public render(): string
	{
		return (
			`Template${this.className}.prototype.${this.name} = function(tmpl, parent, setup)\n` +
			`{\n` +
			`	var root = this;\n` +
			`	if (setup) {\n` +
			`		setup(tmpl);\n` +
			`	}\n` +
			`${indent(this.renderChildNodes())}\n` +
			`	return tmpl;\n` +
			`};`
		);
	}

}


export class TemplateNodeComment extends TemplateNode
{


	public text: string;

	public insertBefore: boolean;


	constructor(text: string, insertBefore: boolean = false, parent: TemplateNodeParent = null)
	{
		super(parent);

		this.text = text;
		this.insertBefore = insertBefore;
	}


	public render(): string
	{
		let method = this.insertBefore ? '_insertCommentBefore' : '_appendComment';

		if (!this.setup.length) {
			return `tmpl.${method}(parent, "${this.text}");`
		}

		return (
			`tmpl.${method}(parent, "${this.text}", function(parent) {\n` +
			`${indent(this.renderSetup())}\n` +
			`});`
		);
	}

}


export class TemplateNodeText extends TemplateNode
{


	public text: string;

	public insertBefore: boolean;


	constructor(text: string, insertBefore: boolean = false, parent: TemplateNodeParent = null)
	{
		super(parent);

		this.text = text;
		this.insertBefore = insertBefore;
	}


	public render(): string
	{
		let method = this.insertBefore ? '_insertTextBefore' : '_appendText';

		if (!this.setup.length) {
			return `tmpl.${method}(parent, "${this.text}");`;
		}

		return (
			`tmpl.${method}(parent, "${this.text}", function(text) {\n` +
			`${indent(this.renderSetup())}\n` +
			`});`
		);
	}

}


export class TemplateNodeElement extends TemplateNodeParent
{


	public name: string;

	public insertBefore: boolean;

	public attributes: {[name: string]: string} = {};

	public childNodes: Array<TemplateNode>;


	constructor(name: string, insertBefore: boolean = false, parentNode: TemplateNodeParent = null)
	{
		super(parentNode);

		this.name = name;
		this.insertBefore = insertBefore;
	}


	public setAttribute(name: string, value: string): void
	{
		this.attributes[name] = value;
	}


	public render(): string
	{
		let method = this.insertBefore ? '_insertElementBefore' : '_appendElement';

		if (!this.setup.length && !this.childNodes.length) {
			if (!keys(this.attributes).length) {
				return `tmpl.${method}(parent, "${this.name}");`;
			}

			return `tmpl.${method}(parent, "${this.name}", ${this.renderAttributes()});`;
		}

		let setup = [
			this.renderSetup(),
			this.renderChildNodes(),
		];

		setup = filter(setup, (block: string) => {
			return block !== '';
		});

		return (
			`tmpl.${method}(parent, "${this.name}", ${this.renderAttributes()}, function(parent) {\n` +
			`${indent(setup.join('\n'))}\n` +
			`});`
		);
	}


	private renderAttributes(): string
	{
		let attributes = [];

		forEach(this.attributes, (value: string, name: string) => {
			attributes.push(`"${name}": "${value}"`);
		});

		return `{${attributes.join(', ')}}`;
	}

}