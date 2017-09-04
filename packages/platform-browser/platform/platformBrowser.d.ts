import { DirectiveDefinition } from '@slicky/core/metadata';
import { ClassType } from '@slicky/lang';
import { Template } from '@slicky/templates-runtime/templates';
import { Application, PlatformInterface } from '@slicky/application';
export declare class PlatformBrowser implements PlatformInterface {
    private compiler;
    constructor();
    compileComponentTemplate(metadata: DirectiveDefinition): ClassType<Template>;
    getTemplateTypeByHash(hash: number): ClassType<Template>;
    run(application: Application, el: HTMLElement): void;
    private createTemplateType(code);
}
