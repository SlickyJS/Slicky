export interface BuilderNodeInterface {
    render(): string;
}
export declare class BuilderNodesContainer<T extends BuilderNodeInterface> implements BuilderNodeInterface {
    delimiter: string;
    private nodes;
    constructor(nodes?: Array<T>, delimiter?: string);
    add(node: T | string): void;
    addList(nodes: Array<T>): void;
    replace(container: BuilderNodesContainer<T>): void;
    isEmpty(): boolean;
    render(): string;
}
export declare function createCode(code: string): BuilderCode;
export declare class BuilderCode implements BuilderNodeInterface {
    code: string;
    constructor(code: string);
    render(): string;
}
export declare function createIdentifier(identifier: string): BuilderIdentifier;
export declare class BuilderIdentifier extends BuilderCode {
}
export declare function createString(str: string): BuilderString;
export declare class BuilderString extends BuilderCode {
    render(): string;
}
export declare function createReturn(node: BuilderNodeInterface): BuilderReturn;
export declare class BuilderReturn implements BuilderNodeInterface {
    node: BuilderNodeInterface;
    constructor(node: BuilderNodeInterface);
    render(): string;
}
export declare function createFunction(name: string, args?: Array<string>, setup?: (fn: BuilderFunction) => void): BuilderFunction;
export declare class BuilderFunction implements BuilderNodeInterface {
    name: string;
    args: Array<string>;
    body: BuilderNodesContainer<BuilderNodeInterface>;
    constructor(name?: string, args?: Array<string>);
    render(): string;
}
export declare function createClass(name: string, args?: Array<string>, setup?: (cls: BuilderClass) => void): BuilderClass;
export declare class BuilderClass implements BuilderNodeInterface {
    name: string;
    args: Array<string>;
    beforeClass: BuilderNodesContainer<BuilderNodeInterface>;
    afterClass: BuilderNodesContainer<BuilderNodeInterface>;
    body: BuilderNodesContainer<BuilderNodeInterface>;
    methods: BuilderNodesContainer<BuilderMethod>;
    constructor(name: string, args?: Array<string>);
    render(): string;
}
export declare function createMethod(parent: BuilderClass, name: string, args?: Array<string>, setup?: (method: BuilderMethod) => void): BuilderMethod;
export declare class BuilderMethod implements BuilderNodeInterface {
    parent: BuilderClass;
    name: string;
    args: Array<string>;
    body: BuilderNodesContainer<BuilderNodeInterface>;
    end: BuilderNodesContainer<BuilderNodeInterface>;
    constructor(parent: BuilderClass, name: string, args?: Array<string>);
    render(): string;
}
export declare function createTemplateMethod(parent: BuilderClass, id: number, setup?: (method: BuilderTemplateMethod) => void): BuilderTemplateMethod;
export declare class BuilderTemplateMethod extends BuilderMethod {
    id: number;
    constructor(parent: BuilderClass, id: number);
}
export declare function createMethodCall(caller: BuilderNodeInterface, method: string, args?: Array<BuilderNodeInterface>): BuilderMethodCall;
export declare class BuilderMethodCall implements BuilderNodeInterface {
    caller: BuilderNodeInterface;
    method: string;
    args: BuilderNodesContainer<BuilderNodeInterface>;
    constructor(caller: BuilderNodeInterface, method: string, args?: Array<BuilderNodeInterface>);
    render(): string;
}
export declare function createVar(name: string, value: BuilderNodeInterface): BuilderVar;
export declare class BuilderVar implements BuilderNodeInterface {
    name: string;
    value: BuilderNodeInterface;
    constructor(name: string, value: BuilderNodeInterface);
    render(): string;
}
export declare function createAddComment(comment: string, appendMode?: boolean, setup?: (comment: BuilderAddComment) => void): BuilderAddComment;
export declare class BuilderAddComment implements BuilderNodeInterface {
    comment: string;
    appendMode: boolean;
    setup: BuilderNodesContainer<BuilderNodeInterface>;
    constructor(comment: string, appendMode?: boolean);
    render(): string;
}
export declare function createAddText(text: string, appendMode?: boolean, setup?: (text: BuilderAddText) => void): BuilderAddText;
export declare class BuilderAddText implements BuilderNodeInterface {
    text: string;
    appendMode: boolean;
    setup: BuilderNodesContainer<BuilderNodeInterface>;
    constructor(text: string, appendMode?: boolean);
    render(): string;
}
export declare function createAddElement(name: string, appendMode?: boolean, setup?: (element: BuilderAddElement) => void): BuilderAddElement;
export declare class BuilderAddElement implements BuilderNodeInterface {
    name: string;
    attributes: {
        [name: string]: string;
    };
    appendMode: boolean;
    setup: BuilderNodesContainer<BuilderNodeInterface>;
    constructor(name: string, appendMode?: boolean);
    setAttribute(name: string, value: string): void;
    render(): string;
}
export declare function createElementEventListener(event: string, callback: string, preventDefault?: boolean): BuilderElementEventListener;
export declare class BuilderElementEventListener implements BuilderNodeInterface {
    event: string;
    callback: string;
    preventDefault: boolean;
    constructor(event: string, callback: string, preventDefault?: boolean);
    render(): string;
}
export declare function createWatch(watch: string, setup?: (watcher: BuilderWatch) => void): BuilderWatch;
export declare class BuilderWatch implements BuilderNodeInterface {
    watch: string;
    update: BuilderNodesContainer<BuilderNodeInterface>;
    watchParent: boolean;
    constructor(watch: string, watchParent?: boolean);
    render(): string;
}
export declare function createImportTemplate(templateId: number, factorySetup?: Array<BuilderNodeInterface>, setup?: (template: BuilderImportTemplate) => void): BuilderImportTemplate;
export declare class BuilderImportTemplate implements BuilderNodeInterface {
    templateId: number;
    factorySetup: BuilderNodesContainer<BuilderNodeInterface>;
    constructor(templateId: number, factorySetup?: Array<BuilderNodeInterface>);
    render(): string;
}
export declare function createSetParameter(name: string, value: string): BuilderSetParameter;
export declare class BuilderSetParameter implements BuilderNodeInterface {
    name: string;
    value: string;
    constructor(name: string, value: string);
    render(): string;
}
export declare function createTemplateOnDestroy(callParent?: boolean, setup?: (node: BuilderTemplateOnDestroy) => void): BuilderTemplateOnDestroy;
export declare class BuilderTemplateOnDestroy implements BuilderNodeInterface {
    callParent: boolean;
    callback: BuilderNodesContainer<BuilderNodeInterface>;
    constructor(callParent?: boolean);
    render(): string;
}
export declare function createEmbeddedTemplatesContainer(templateId: number, setup?: (container: BuilderEmbeddedTemplatesContainer) => void): BuilderEmbeddedTemplatesContainer;
export declare class BuilderEmbeddedTemplatesContainer implements BuilderNodeInterface {
    templateId: number;
    setup: BuilderNodesContainer<BuilderNodeInterface>;
    constructor(templateId: number);
    render(): string;
}
export declare function createFunctionCall(left: BuilderNodeInterface, args?: Array<BuilderNodeInterface>): BuilderFunctionCall;
export declare class BuilderFunctionCall implements BuilderNodeInterface {
    left: BuilderNodeInterface;
    args: BuilderNodesContainer<BuilderNodeInterface>;
    constructor(left: BuilderNodeInterface, args?: Array<BuilderNodeInterface>);
    render(): string;
}
export declare function createIfHelper(templateId: number, watch: string): BuilderIfHelper;
export declare class BuilderIfHelper implements BuilderNodeInterface {
    templateId: number;
    watch: string;
    constructor(templateId: number, watch: string);
    render(): string;
}
export declare function createForOfHelper(id: number, forOf: string, forItem: string, forIndex?: string, trackBy?: string): BuilderForOfHelper;
export declare class BuilderForOfHelper implements BuilderNodeInterface {
    id: number;
    forOf: string;
    forItem: string;
    forIndex: string;
    trackBy: string;
    constructor(id: number, forOf: string, forItem: string, forIndex?: string, trackBy?: string);
    render(): string;
}
