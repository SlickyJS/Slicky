import { DirectiveDefinition } from '@slicky/core';
import { ClassType } from '@slicky/lang';
import { Template } from '@slicky/templates-runtime';
import { Application, PlatformInterface } from '@slicky/application';
export declare class PlatformServer implements PlatformInterface {
    private templatesFactory;
    constructor(templatesFactory: (hash: number) => ClassType<Template>);
    compileComponentTemplate(metadata: DirectiveDefinition): ClassType<Template>;
    getTemplateTypeByHash(hash: number): ClassType<Template>;
    run(application: Application, el: HTMLElement): void;
}
