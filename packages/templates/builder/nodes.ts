import {map, indent, forEach, isFunction, isString, filter} from '@slicky/utils';


function applyReplacements(code: string, replacements: {[name: string]: string}): string
{
	forEach(replacements, (replacement: string, name: string) => {
		code = code.replace(new RegExp(`{{\\s${name}\\s}}`, 'g'), replacement);
	});

	return code;
}


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


	public addList(nodes: Array<T>): void
	{
		this.nodes = this.nodes.concat(nodes);
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


/***************** IDENTIFIER *****************/


export function createIdentifier(identifier: string): BuilderIdentifier
{
	return new BuilderIdentifier(identifier);
}

export class BuilderIdentifier extends BuilderCode
{
}


/***************** STRING *****************/


export function createString(str: string): BuilderString
{
	return new BuilderString(str);
}

export class BuilderString extends BuilderCode
{


	public render(): string
	{
		return `"${super.render()}"`;
	}

}


/***************** RETURN *****************/


export function createReturn(node: BuilderNodeInterface): BuilderReturn
{
	return new BuilderReturn(node);
}

export class BuilderReturn implements BuilderNodeInterface
{


	public node: BuilderNodeInterface;


	constructor(node: BuilderNodeInterface)
	{
		this.node = node;
	}


	public render(): string
	{
		return `return ${this.node.render()}`;
	}

}


/***************** FUNCTION *****************/


export function createFunction(name: string, args: Array<string> = [], setup: (fn: BuilderFunction) => void = null): BuilderFunction
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

	public body = new BuilderNodesContainer;


	constructor(name: string = null, args: Array<string> = [])
	{
		this.name = name;
		this.args = args;
	}


	public render(): string
	{
		let name = this.name === null ? '' : ` ${this.name}`;
		let firstListDelimiter = this.name === null ? ' ' : '\n';

		return (
			`function${name}(${this.args.join(', ')})${firstListDelimiter}` +
			`{\n` +
			`${indent(this.body.render())}\n` +
			`}`
		);
	}

}


/***************** CLASS *****************/


export function createClass(name: string, args: Array<string> = [], setup: (cls: BuilderClass) => void = null): BuilderClass
{
	let cls = new BuilderClass(name, args);

	if (isFunction(setup)) {
		setup(cls);
	}

	return cls;
}

export class BuilderClass implements BuilderNodeInterface
{


	public name: string;

	public args: Array<string>;

	public beforeClass = new BuilderNodesContainer;

	public afterClass = new BuilderNodesContainer;

	public body = new BuilderNodesContainer;

	public methods = new BuilderNodesContainer<BuilderMethod>();


	constructor(name: string, args: Array<string> = [])
	{
		this.name = name;
		this.args = args;
	}


	public render(): string
	{
		let r = (code: string): string => {
			return applyReplacements(code, {
				className: this.name,
			});
		};

		return (
			`${r(this.beforeClass.render())}\n` +
			`function ${this.name}(${this.args.join(', ')})\n` +
			`{\n` +
			`${indent(r(this.body.render()))}\n` +
			`}\n` +
			`${r(this.methods.render())}\n` +
			r(this.afterClass.render())
		);
	}

}


/***************** METHOD *****************/


export function createMethod(parent: BuilderClass, name: string, args: Array<string> = [], setup: (method: BuilderMethod) => void = null): BuilderMethod
{
	let method = new BuilderMethod(parent, name, args);

	if (isFunction(setup)) {
		setup(method);
	}

	return method;
}

export class BuilderMethod implements BuilderNodeInterface
{


	public parent: BuilderClass;

	public name: string;

	public args: Array<string>;

	public beginning = new BuilderNodesContainer;

	public body = new BuilderNodesContainer;

	public end = new BuilderNodesContainer;


	constructor(parent: BuilderClass, name: string, args: Array<string> = [])
	{
		this.parent = parent;
		this.name = name;
		this.args = args;
	}


	public render(): string
	{
		const body = filter([
			this.beginning.render(),
			this.body.render(),
			this.end.render(),
		], (code) => {
			return code !== '';
		});

		return (
			`${this.parent.name}.prototype.${this.name} = function(${this.args.join(', ')})\n` +
			`{\n` +
			`${indent(body.join('\n'))}\n` +
			`};`
		);
	}

}


/***************** TEMPLATE METHOD *****************/


export function createTemplateMethod(parent: BuilderClass, id: number, setup: (method: BuilderTemplateMethod) => void = null): BuilderTemplateMethod
{
	let method = new BuilderTemplateMethod(parent, id);

	if (isFunction(setup)) {
		setup(method);
	}

	return method;
}

export class BuilderTemplateMethod extends BuilderMethod
{


	public id: number;


	constructor(parent: BuilderClass, id: number)
	{
		super(parent, `template${id}`, ['tmpl', 'parent', 'setup']);

		this.id = id;

		this.body.add('var root = this;');
		this.body.add(
			`if (setup) {\n` +
			`	setup(tmpl);\n` +
			`}`
		);

		this.end.add('tmpl.init();');
		this.end.add('return tmpl;');
	}

}


/***************** METHOD CALL *****************/


export function createMethodCall(caller: BuilderNodeInterface, method: string, args: Array<BuilderNodeInterface> = []): BuilderMethodCall
{
	return new BuilderMethodCall(caller, method, args);
}

export class BuilderMethodCall implements BuilderNodeInterface
{


	public caller: BuilderNodeInterface;

	public method: string;

	public args: BuilderNodesContainer<BuilderNodeInterface>;


	constructor(caller: BuilderNodeInterface, method: string, args: Array<BuilderNodeInterface> = [])
	{
		this.caller = caller;
		this.method = method;
		this.args = new BuilderNodesContainer(args, ', ');
	}


	public render(): string
	{
		return `${this.caller.render()}.${this.method}(${this.args.render()})`;
	}

}


/***************** VAR *****************/


export function createVar(name: string, value: BuilderNodeInterface): BuilderVar
{
	return new BuilderVar(name, value);
}

export class BuilderVar implements BuilderNodeInterface
{


	public name: string;

	public value: BuilderNodeInterface;


	constructor(name: string, value: BuilderNodeInterface)
	{
		this.name = name;
		this.value = value;
	}


	public render(): string
	{
		return `var ${this.name} = ${this.value.render()};`;
	}

}


/***************** ADD COMMENT *****************/


export function createAddComment(comment: string, appendMode: boolean = true, setup: (comment: BuilderAddComment) => void = null): BuilderAddComment
{
	let node = new BuilderAddComment(comment, appendMode);

	if (isFunction(setup)) {
		setup(node);
	}

	return node;
}

export class BuilderAddComment implements BuilderNodeInterface
{


	public comment: string;

	public appendMode: boolean;

	public setup = new BuilderNodesContainer;


	constructor(comment: string, appendMode: boolean = true)
	{
		this.comment = comment;
		this.appendMode = appendMode;
	}


	public render(): string
	{
		let args: Array<BuilderNodeInterface> = [
			createIdentifier('parent'),
			createString(this.comment),
		];

		if (!this.setup.isEmpty()) {
			args.push(createFunction(null, ['parent'], (fn) => {
				fn.body.replace(this.setup);
			}));
		}

		return createMethodCall(
			createIdentifier('tmpl'),
			this.appendMode ? '_appendComment' : '_insertCommentBefore',
			args
		).render() + ';';
	}

}


/***************** ADD TEXT *****************/


export function createAddText(text: string, appendMode: boolean = true, setup: (text: BuilderAddText) => void = null): BuilderAddText
{
	let node = new BuilderAddText(text, appendMode);

	if (isFunction(setup)) {
		setup(node);
	}

	return node;
}

export class BuilderAddText implements BuilderNodeInterface
{


	public text: string;

	public appendMode: boolean;

	public setup = new BuilderNodesContainer;


	constructor(text: string, appendMode: boolean = true)
	{
		this.text = text;
		this.appendMode = appendMode;
	}


	public render(): string
	{
		let args: Array<BuilderNodeInterface> = [
			createIdentifier('parent'),
			createString(this.text),
		];

		if (!this.setup.isEmpty()) {
			args.push(createFunction(null, ['text'], (fn) => {
				fn.body.replace(this.setup);
			}));
		}

		return createMethodCall(
			createIdentifier('tmpl'),
			this.appendMode ? '_appendText' : '_insertTextBefore',
			args
		).render() + ';';
	}

}


/***************** ADD ELEMENT *****************/


export function createAddElement(name: string, appendMode: boolean = true, setup: (element: BuilderAddElement) => void = null): BuilderAddElement
{
	let element = new BuilderAddElement(name, appendMode);

	if (isFunction(setup)) {
		setup(element);
	}

	return element;
}

export class BuilderAddElement implements BuilderNodeInterface
{


	public name: string;

	public attributes: {[name: string]: string} = {};

	public appendMode: boolean;

	public setup = new BuilderNodesContainer;


	constructor(name: string, appendMode: boolean = true)
	{
		this.name = name;
		this.appendMode = appendMode;
	}


	public setAttribute(name: string, value: string): void
	{
		this.attributes[name] = value;
	}


	public render(): string
	{
		let attributes = [];

		forEach(this.attributes, (value: string, name: string) => {
			attributes.push(`"${name}": "${value}"`);
		});

		let args: Array<BuilderNodeInterface> = [
			createIdentifier('parent'),
			createString(this.name),
		];

		if (!attributes.length && !this.setup.isEmpty()) {
			args.push(createCode('{}'));

		} else if (attributes.length) {
			args.push(createCode(`{${attributes.join(', ')}}`));
		}

		if (!this.setup.isEmpty()) {
			args.push(createFunction(null, ['parent'], (fn) => {
				fn.body.replace(this.setup);
			}));
		}

		return createMethodCall(
			createIdentifier('tmpl'),
			this.appendMode ? '_appendElement' : '_insertElementBefore',
			args
		).render() + ';';
	}

}


/***************** ELEMENT EVENT LISTENER *****************/


export function createElementEventListener(event: string, callback: string, preventDefault: boolean = false): BuilderElementEventListener
{
	return new BuilderElementEventListener(event, callback, preventDefault);
}

export class BuilderElementEventListener implements BuilderNodeInterface
{


	public event: string;

	public callback: string;

	public preventDefault: boolean;


	constructor(event: string, callback: string, preventDefault: boolean = false)
	{
		this.event = event;
		this.callback = callback;
		this.preventDefault = preventDefault;
	}


	public render(): string
	{
		return createMethodCall(createIdentifier('tmpl'), '_addElementEventListener', [
			createIdentifier('parent'),
			createString(this.event),
			createFunction(null, ['$event'], (fn) => {
				if (this.preventDefault) {
					fn.body.add(createCode('$event.preventDefault();'));
				}

				fn.body.add(this.callback + ';')
			}),
		]).render() + ';';
	}

}


/***************** WATCH *****************/


export function createWatch(watch: string, setup: (watcher: BuilderWatch) => void = null): BuilderWatch
{
	let watcher = new BuilderWatch(watch);

	if (isFunction(setup)) {
		setup(watcher);
	}

	return watcher;
}

export class BuilderWatch implements BuilderNodeInterface
{


	public watch: string;

	public update = new BuilderNodesContainer;

	public watchParent: boolean;


	constructor(watch: string, watchParent: boolean = false)
	{
		this.watch = watch;
		this.watchParent = watchParent;
	}


	public render(): string
	{
		let caller = this.watchParent ? 'tmpl.parent' : 'tmpl';

		return createMethodCall(
			createMethodCall(createIdentifier(caller), 'getProvider', [createString('watcher')]),
			'watch',
			[
				createFunction(null, [], (fn) => fn.body.add(this.watch + ';')),
				createFunction(null, ['value'], (fn) => fn.body.replace(this.update)),
			]
		).render() + ';';
	}

}


/***************** IMPORT TEMPLATE *****************/


export function createImportTemplate(templateId: number, factorySetup: Array<BuilderNodeInterface> = [], setup: (template: BuilderImportTemplate) => void = null): BuilderImportTemplate
{
	let template = new BuilderImportTemplate(templateId, factorySetup);

	if (isFunction(setup)) {
		setup(template);
	}

	return template;
}

export class BuilderImportTemplate implements BuilderNodeInterface
{


	public templateId: number;

	public factorySetup: BuilderNodesContainer<BuilderNodeInterface>;


	constructor(templateId: number, factorySetup: Array<BuilderNodeInterface> = [])
	{
		this.templateId = templateId;
		this.factorySetup = new BuilderNodesContainer(factorySetup);
	}


	public render(): string
	{
		return createMethodCall(createIdentifier('root'), `template${this.templateId}`, [
			createIdentifier('tmpl'),
			createIdentifier('parent'),
			createFunction(null, ['tmpl'], (fn) => fn.body.replace(this.factorySetup))
		]).render();
	}

}


/***************** SET PARAMETER *****************/


export function createSetParameter(name: string, value: string): BuilderSetParameter
{
	return new BuilderSetParameter(name, value);
}

export class BuilderSetParameter implements BuilderNodeInterface
{


	public name: string;

	public value: string;


	constructor(name: string, value: string)
	{
		this.name = name;
		this.value = value;
	}


	public render(): string
	{
		return `tmpl.setParameter("${this.name}", ${this.value});`;
	}

}


/***************** TEMPLATE ON DESTROY *****************/


export function createTemplateOnDestroy(callParent: boolean = false, setup: (node: BuilderTemplateOnDestroy) => void = null): BuilderTemplateOnDestroy
{
	let node = new BuilderTemplateOnDestroy(callParent);

	if (isFunction(setup)) {
		setup(node);
	}

	return node;
}

export class BuilderTemplateOnDestroy implements BuilderNodeInterface
{


	public callParent: boolean;

	public callback = new BuilderNodesContainer;


	constructor(callParent: boolean = false)
	{
		this.callParent = callParent;
	}


	public render(): string
	{
		return createMethodCall(
			createCode(this.callParent ? 'tmpl.parent' : 'tmpl'),
			'onDestroy',
			[
				createFunction(null, [], (fn) => fn.body.replace(this.callback)),
			]
		).render() + ';';
	}

}


/***************** EMBEDDED TEMPLATES CONTAINER *****************/


export function createEmbeddedTemplatesContainer(templateId: number, setup: (container: BuilderEmbeddedTemplatesContainer) => void = null): BuilderEmbeddedTemplatesContainer
{
	let container = new BuilderEmbeddedTemplatesContainer(templateId);

	if (isFunction(setup)) {
		setup(container);
	}

	return container;
}

export class BuilderEmbeddedTemplatesContainer implements BuilderNodeInterface
{


	public templateId: number;

	public setup = new BuilderNodesContainer;


	constructor(templateId: number)
	{
		this.templateId = templateId;
	}


	public render(): string
	{
		return (
			`root._createEmbeddedTemplatesContainer(tmpl, parent, function(tmpl, parent, setup) {\n` +
			`	return root.template${this.templateId}(tmpl, parent, setup);\n` +
			`}, function(tmpl) {\n` +
			`${indent(this.setup.render())}\n` +
			`	tmpl.init();\n` +
			`});`
		)
	}

}


/***************** FUNCTION CALL *****************/


export function createFunctionCall(left: BuilderNodeInterface, args: Array<BuilderNodeInterface> = []): BuilderFunctionCall
{
	return new BuilderFunctionCall(left, args);
}

export class BuilderFunctionCall implements BuilderNodeInterface
{


	public left: BuilderNodeInterface;

	public args: BuilderNodesContainer<BuilderNodeInterface>;


	constructor(left: BuilderNodeInterface, args: Array<BuilderNodeInterface> = [])
	{
		this.left = left;
		this.args = new BuilderNodesContainer(args, ', ');
	}


	public render(): string
	{
		return `${this.left.render()}(${this.args.render()});`;
	}

}


/***************** CLASS HELPER *****************/


export function createClassHelper(className: string, watch: string): BuilderClassHelper
{
	return new BuilderClassHelper(className, watch);
}

export class BuilderClassHelper implements BuilderNodeInterface
{


	public className: string;

	public watch: string;


	constructor(className: string, watch: string)
	{
		this.className = className;
		this.watch = watch;
	}


	public render(): string
	{
		let watcher = createWatch(this.watch, (watcher) => {
			watcher.update.add('helper.check(value);');
		});

		return (
			`tmpl.getProvider("classHelperFactory")(parent, "${this.className}", function(helper) {\n` +
			`${indent(watcher.render())}\n` +
			`});\n`
		);
	}

}


/***************** INSERT STYLE RULE *****************/


export function createInsertStyleRule(selectors: Array<string>, rules: Array<string> = []): BuilderInsertStyleRule
{
	return new BuilderInsertStyleRule(selectors, rules);
}

export class BuilderInsertStyleRule implements BuilderNodeInterface
{


	public selectors: Array<string>;

	public rules: Array<string>;


	constructor(selectors: Array<string>, rules: Array<string> = [])
	{
		this.selectors = selectors;
		this.rules = rules;
	}


	public render(): string
	{
		const rules = map(this.rules, (rule: string) => {
			return `"${rule}"`;
		});

		return (
			`root.insertStyleRule(\n` +
			`	"${this.selectors.join(', ')}",\n` +
			`	[\n` +
			`${indent(rules.join(',\n'), 2)}\n` +
			`	]\n` +
			`);`
		);
	}

}


/***************** IF HELPER *****************/


export function createIfHelper(templateId: number, watch: string): BuilderIfHelper
{
	return new BuilderIfHelper(templateId, watch);
}

export class BuilderIfHelper implements BuilderNodeInterface
{


	public templateId: number;

	public watch: string;


	constructor(templateId: number, watch: string)
	{
		this.templateId = templateId;
		this.watch = watch;
	}


	public render(): string
	{
		return createEmbeddedTemplatesContainer(this.templateId, (container) => {
			container.setup.add(
				createFunctionCall(
					createMethodCall(
						createIdentifier('tmpl'),
						'getProvider',
						[
							createString('ifHelperFactory'),
						]
					),
					[
						createIdentifier('tmpl'),
						createFunction(null, ['helper'], (fn) => {
							fn.body.add(
								createWatch(
									this.watch,
									(watcher) => {
										watcher.update.add('helper.check(value);')
									}
								)
							)
						}),
					]
				)
			)
		}).render();
	}

}


/***************** FOR HELPER *****************/


export function createForOfHelper(id: number, forOf: string, forItem: string, forIndex: string = null, trackBy: string = null): BuilderForOfHelper
{
	return new BuilderForOfHelper(id, forOf, forItem, forIndex, trackBy);
}

export class BuilderForOfHelper implements BuilderNodeInterface
{


	public id: number;

	public forOf: string;

	public forItem: string;

	public forIndex: string;

	public trackBy: string;


	constructor(id: number, forOf: string, forItem: string, forIndex: string = null, trackBy: string = null)
	{
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
			`	tmpl.init();\n` +
			`});`
		);
	}

}
