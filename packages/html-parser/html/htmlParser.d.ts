import * as _ from './ast';
export declare class HTMLParser {
    private input;
    private ast;
    constructor(input: string);
    parse(): _.ASTHTMLNodeDocumentFragment;
    private process(document);
    private processChildNodes(childNodes);
    private processText(text);
    private processElement(element);
    private processElementTemplates(element);
    private processElementAttributes(attributes);
    private tokenizeText(text);
}
