import { Container } from '@slicky/di';
import { ClassType } from '@slicky/lang';
import { IPlatform } from '@slicky/core';
import { ApplicationTemplate } from '@slicky/templates-runtime';
export interface ApplicationOptions {
    document?: Document;
    appElement?: HTMLElement | Document;
    directives?: Array<ClassType<any>>;
}
export declare class Application {
    private platform;
    private template;
    private container;
    private document;
    private appElement;
    private directives;
    constructor(platform: IPlatform, template: ApplicationTemplate, container: Container, options?: ApplicationOptions);
    run(): void;
}
