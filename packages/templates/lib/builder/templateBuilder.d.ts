import { Matcher } from '@slicky/query-selector';
import * as _ from '@slicky/html-parser';
import * as b from './nodes';
export declare class TemplateBuilder {
    private templateClass;
    private templateMainMethod;
    private matcher;
    private templatesCount;
    private templates;
    constructor(className: string, matcher: Matcher);
    getMainMethod(): b.BuilderMethod;
    addTemplate(element: _.ASTHTMLNodeElement, setup?: (method: b.BuilderTemplateMethod) => void): void;
    findTemplate(selector: string): b.BuilderTemplateMethod;
    render(): string;
}
