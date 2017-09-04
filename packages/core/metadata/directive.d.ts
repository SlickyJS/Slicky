export interface DirectiveOptions {
    selector: string;
    exportAs?: string;
    [name: string]: any;
}
export declare class DirectiveAnnotationDefinition {
    _options: DirectiveOptions;
    selector: string;
    exportAs: string;
    constructor(options: DirectiveOptions);
}
export declare let Directive: any;
