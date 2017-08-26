import { IDocumentWalker } from '@slicky/query-selector';
import * as _ from '@slicky/html-parser';
export declare class DocumentWalker implements IDocumentWalker {
    getNodeName(node: _.ASTHTMLNodeElement): string;
    isElement(node: _.ASTHTMLNode): boolean;
    isString(node: _.ASTHTMLNode): boolean;
    getParentNode(node: _.ASTHTMLNodeElement): _.ASTHTMLNodeParent;
    getChildNodes(parent: _.ASTHTMLNodeParent): Array<_.ASTHTMLNode>;
    getAttribute(node: _.ASTHTMLNodeElement, name: string): string;
}
