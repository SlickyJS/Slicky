import { IPlatform, DirectiveDefinition } from '@slicky/core';
import { ClassType } from '@slicky/lang';
import { Template } from '@slicky/templates-runtime';
export declare class BrowserPlatform implements IPlatform {
    private compiler;
    constructor();
    compileComponentTemplate(metadata: DirectiveDefinition): ClassType<Template>;
    getTemplateTypeByHash(hash: number): ClassType<Template>;
    private createTemplateType(code);
}
