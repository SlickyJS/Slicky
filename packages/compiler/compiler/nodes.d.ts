import * as b from '@slicky/templates/builder';
import { DirectiveDefinitionType } from '@slicky/core/metadata';
export declare function createComponentSetHostElement(property: string): BuilderComponentSetHostElement;
export declare class BuilderComponentSetHostElement implements b.BuilderNodeInterface {
    property: string;
    constructor(property: string);
    render(): string;
}
export declare function createCreateDirective(hash: number, type: DirectiveDefinitionType, setup?: (createDirective: BuilderCreateDirective) => void): BuilderCreateDirective;
export declare class BuilderCreateDirective implements b.BuilderNodeInterface {
    hash: number;
    type: DirectiveDefinitionType;
    setup: b.BuilderNodesContainer<b.BuilderNodeInterface>;
    constructor(hash: number, type: DirectiveDefinitionType);
    render(): string;
}
export declare function createDirectivePropertyWrite(property: string, value: string, rootComponent?: boolean): BuilderDirectivePropertyWrite;
export declare class BuilderDirectivePropertyWrite implements b.BuilderNodeInterface {
    property: string;
    value: string;
    rootComponent: boolean;
    constructor(property: string, value: string, rootComponent?: boolean);
    render(): string;
}
export declare function createDirectiveMethodCall(method: string, args?: Array<string>, rootComponent?: boolean): BuilderDirectiveMethodCall;
export declare class BuilderDirectiveMethodCall implements b.BuilderNodeInterface {
    method: string;
    args: Array<string>;
    rootComponent: boolean;
    constructor(method: string, args?: Array<string>, rootComponent?: boolean);
    render(): string;
}
export declare function createDirectiveOutput(output: string, call: string): BuilderDirectiveOutput;
export declare class BuilderDirectiveOutput implements b.BuilderNodeInterface {
    output: string;
    call: string;
    constructor(output: string, call: string);
    render(): string;
}
export declare function createDirectiveOnInit(): BuilderDirectiveOnInit;
export declare class BuilderDirectiveOnInit implements b.BuilderNodeInterface {
    render(): string;
}
export declare function createComponentRender(): BuilderComponentRender;
export declare class BuilderComponentRender implements b.BuilderNodeInterface {
    render(): string;
}
