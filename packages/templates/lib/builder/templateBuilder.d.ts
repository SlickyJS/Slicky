import { Matcher } from '@slicky/query-selector';
import * as _ from '@slicky/html-parser';
import * as t from './nodes';
export declare class TemplateBuilder {
    private className;
    private matcher;
    private templatesCount;
    private templates;
    private methods;
    constructor(className: string, matcher: Matcher);
    getMainMethod(): t.TemplateMethod;
    addTemplate(element: _.ASTHTMLNodeElement, fn?: (template: t.TemplateMethodTemplate) => void): void;
    findTemplate(selector: string): t.TemplateMethodTemplate;
    render(): string;
    private renderMethods();
}
