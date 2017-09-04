export interface CompilerTemplatesList {
    [hash: number]: string;
}
export interface CompilerSlickyOptions {
    outDir: string;
    applicationFile: string;
}
export declare class Compiler {
    compileAndWrite(tsconfigPath: string, done?: (outDir: string, factory: string, templates: CompilerTemplatesList) => void): void;
    compile(tsconfigPath: string, done?: (outDir: string, factory: string, templates: CompilerTemplatesList) => void): void;
    private processTemplates(templates);
}
