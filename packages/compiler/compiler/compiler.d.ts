import { DirectiveDefinition } from '@slicky/core/metadata';
export declare class Compiler {
    private templates;
    compile(metadata: DirectiveDefinition): string;
    getTemplates(): {
        [hash: number]: string;
    };
    getTemplateByHash(hash: number): string;
    private createEngine(metadata);
}
