export declare abstract class TemplateNodeSetupAware {
    setup: Array<TemplateSetup>;
    addSetup(setup: TemplateSetup, fn?: (setup: TemplateSetup) => void): void;
    addSetupParameterSet(name: string, value: string): void;
    addSetupWatch(watch: string, update: string): void;
    addSetupAddEventListener(name: string, callback: string, preventDefault?: boolean): void;
    addSetupIf(id: number, watch: string): void;
    addSetupForOf(id: number, forOf: string, forItem: string, forIndex?: string, trackBy?: string): void;
    addSetupImportTemplate(id: number, fn?: (importTemplate: TemplateSetupImportTemplate) => void): void;
    renderSetup(): string;
}
export declare abstract class TemplateSetup extends TemplateNodeSetupAware {
    abstract render(): string;
}
export declare class TemplateSetupParameterSet extends TemplateSetup {
    name: string;
    value: string;
    constructor(name: string, value: string);
    render(): string;
}
export declare class TemplateSetupAddEventListener extends TemplateSetup {
    name: string;
    callback: string;
    preventDefault: boolean;
    constructor(name: string, callback: string, preventDefault?: boolean);
    render(): string;
}
export declare class TemplateSetupWatch extends TemplateSetup {
    watch: string;
    update: string;
    constructor(watch: string, update: string);
    render(): string;
}
export declare class TemplateSetupIf extends TemplateSetup {
    id: number;
    watch: string;
    constructor(id: number, watch: string);
    render(): string;
}
export declare class TemplateSetupForOf extends TemplateSetup {
    id: number;
    forOf: string;
    forItem: string;
    forIndex: string;
    trackBy: string;
    constructor(id: number, forOf: string, forItem: string, forIndex?: string, trackBy?: string);
    render(): string;
}
export declare class TemplateSetupImportTemplate extends TemplateSetup {
    id: number;
    constructor(id: number);
    render(): string;
}
export declare abstract class TemplateNode extends TemplateNodeSetupAware {
    parentNode: TemplateNodeParent;
    constructor(parentNode?: TemplateNodeParent);
    abstract render(): string;
}
export declare abstract class TemplateNodeParent extends TemplateNode {
    childNodes: Array<TemplateNode>;
    constructor(parentNode?: TemplateNodeParent);
    addComment(text: string, insertBefore?: boolean, fn?: (text: TemplateNodeComment) => void): void;
    addText(text: string, insertBefore?: boolean, fn?: (text: TemplateNodeText) => void): void;
    addElement(elementName: string, insertBefore?: boolean, fn?: (element: TemplateNodeElement) => void): void;
    renderChildNodes(): string;
}
export declare class TemplateMethod extends TemplateNodeParent {
    className: string;
    name: string;
    constructor(className: string, name: string);
    render(): string;
}
export declare class TemplateMethodTemplate extends TemplateMethod {
    id: number;
    constructor(className: string, name: string, id: number);
    render(): string;
}
export declare class TemplateNodeComment extends TemplateNode {
    text: string;
    insertBefore: boolean;
    constructor(text: string, insertBefore?: boolean, parent?: TemplateNodeParent);
    render(): string;
}
export declare class TemplateNodeText extends TemplateNode {
    text: string;
    insertBefore: boolean;
    constructor(text: string, insertBefore?: boolean, parent?: TemplateNodeParent);
    render(): string;
}
export declare class TemplateNodeElement extends TemplateNodeParent {
    name: string;
    insertBefore: boolean;
    attributes: {
        [name: string]: string;
    };
    childNodes: Array<TemplateNode>;
    constructor(name: string, insertBefore?: boolean, parentNode?: TemplateNodeParent);
    setAttribute(name: string, value: string): void;
    render(): string;
    private renderAttributes();
}
