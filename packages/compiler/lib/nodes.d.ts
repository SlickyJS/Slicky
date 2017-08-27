import { TemplateSetup } from '@slicky/templates';
import { DirectiveDefinitionType } from '@slicky/core';
export declare class TemplateSetupDirective extends TemplateSetup {
    hash: number;
    type: DirectiveDefinitionType;
    constructor(hash: number, type: DirectiveDefinitionType);
    render(): string;
}
export declare class TemplateSetupComponentRender extends TemplateSetup {
    render(): string;
}
export declare class TemplateSetupDirectiveOutput extends TemplateSetup {
    output: string;
    call: string;
    constructor(output: string, call: string);
    render(): string;
}
export declare class TemplateSetupDirectiveOnInit extends TemplateSetup {
    render(): string;
}
export declare class TemplateSetupTemplateOnDestroy extends TemplateSetup {
    code: string;
    callParent: boolean;
    constructor(code: string, callParent?: boolean);
    render(): string;
}
export declare class TemplateSetupComponentHostElement extends TemplateSetup {
    property: string;
    constructor(property: string);
    render(): string;
}
export declare class TemplateSetupDirectivePropertyWrite extends TemplateSetup {
    property: string;
    value: string;
    rootComponent: boolean;
    constructor(property: string, value: string, rootComponent?: boolean);
    render(): string;
}
export declare class TemplateSetupDirectiveMethodCall extends TemplateSetup {
    method: string;
    args: string;
    rootComponent: boolean;
    constructor(method: string, args: string, rootComponent?: boolean);
    render(): string;
}
