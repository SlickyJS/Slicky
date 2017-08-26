import { TemplateSetup } from '@slicky/templates';
export declare class TemplateSetupComponent extends TemplateSetup {
    hash: number;
    constructor(hash: number);
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
export declare class TemplateSetupDirectiveOnDestroy extends TemplateSetup {
    render(): string;
}
export declare class TemplateSetupComponentHostElement extends TemplateSetup {
    property: string;
    constructor(property: string);
    render(): string;
}
