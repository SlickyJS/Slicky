import { IPlatform, DirectiveDefinition } from '@slicky/core';
import { ClassType } from '@slicky/lang';
import { Template } from '@slicky/templates-runtime';
export declare class PlatformServer implements IPlatform {
    private templatesFactory;
    constructor(templatesFactory: (hash: number) => ClassType<Template>);
    compileComponentTemplate(metadata: DirectiveDefinition): ClassType<Template>;
    getTemplateTypeByHash(hash: number): ClassType<Template>;
}
