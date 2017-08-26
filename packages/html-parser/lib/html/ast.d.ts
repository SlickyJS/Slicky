import { AST as _ } from 'parse5';
export declare abstract class ASTHTMLNode {
    parentNode: ASTHTMLNodeParent;
}
export declare abstract class ASTHTMLNodeBaseText extends ASTHTMLNode {
    value: string;
    constructor(value: string);
}
export declare class ASTHTMLNodeText extends ASTHTMLNodeBaseText {
}
export declare class ASTHTMLNodeExpression extends ASTHTMLNodeBaseText {
}
export declare abstract class ASTHTMLNodeParent extends ASTHTMLNode {
    childNodes: Array<ASTHTMLNode>;
    constructor(childNodes?: Array<ASTHTMLNode>);
}
export declare class ASTHTMLNodeDocumentFragment extends ASTHTMLNodeParent {
}
export declare abstract class ASTHTMLNodeAttribute {
    name: string;
    value: string;
    constructor(name: string, value: string);
}
export declare class ASTHTMLNodeTextAttribute extends ASTHTMLNodeAttribute {
}
export declare class ASTHTMLNodeExpressionAttribute extends ASTHTMLNodeAttribute {
}
export declare class ASTHTMLNodeExpressionAttributeEvent extends ASTHTMLNodeExpressionAttribute {
    preventDefault: boolean;
}
export declare class ASTHTMLNodeComment extends ASTHTMLNode {
    value: string;
    constructor(value: string);
}
export declare class ASTHTMLNodeElement extends ASTHTMLNodeParent {
    name: string;
    attributes: Array<ASTHTMLNodeAttribute>;
    events: Array<ASTHTMLNodeExpressionAttributeEvent>;
    properties: Array<ASTHTMLNodeExpressionAttribute>;
    exports: Array<ASTHTMLNodeAttribute>;
    templates: Array<ASTHTMLNodeExpressionAttribute>;
    content: ASTHTMLNodeDocumentFragment;
    constructor(name: string, childNodes?: Array<ASTHTMLNode>);
}
export declare class AST implements _.TreeAdapter {
    createDocumentFragment(): ASTHTMLNodeDocumentFragment;
    createElement(tagName: string, namespaceURI: string, attrs: Array<_.Default.Attribute>): ASTHTMLNodeElement;
    appendChild(parentNode: ASTHTMLNodeParent, newNode: ASTHTMLNode): void;
    insertBefore(parentNode: ASTHTMLNodeParent, newNode: ASTHTMLNode, referenceNode: ASTHTMLNode): void;
    setTemplateContent(templateElement: ASTHTMLNodeElement, contentElement: ASTHTMLNodeDocumentFragment): void;
    getTemplateContent(templateElement: ASTHTMLNodeElement): ASTHTMLNodeDocumentFragment;
    detachNode(node: ASTHTMLNode): void;
    insertText(parentNode: ASTHTMLNodeParent, text: string): void;
    insertTextBefore(parentNode: ASTHTMLNodeParent, text: string, referenceNode: ASTHTMLNode): void;
    insertExpressionBefore(parentNode: ASTHTMLNodeParent, expression: string, referenceNode: ASTHTMLNode): void;
    createCommentNode(data: string): any;
    getFirstChild(node: ASTHTMLNodeParent): ASTHTMLNode;
    getParentNode(node: ASTHTMLNode): ASTHTMLNodeParent;
    getTagName(element: ASTHTMLNodeElement): string;
    getAttrList(element: ASTHTMLNodeElement): Array<ASTHTMLNodeAttribute>;
    getNamespaceURI(element: _.Element): string;
    createDocument(): _.Document;
    getChildNodes(node: _.ParentNode): Array<_.Node>;
    setDocumentType(document: _.Document, name: string, publicId: string, systemId: string): void;
    setDocumentMode(document: _.Document, mode: _.DocumentMode): void;
    getDocumentMode(document: _.Document): _.DocumentMode;
    adoptAttributes(recipient: _.Element, attrs: Array<_.Default.Attribute>): void;
    getTextNodeContent(textNode: _.TextNode): string;
    getCommentNodeContent(commentNode: _.CommentNode): string;
    getDocumentTypeNodeName(doctypeNode: _.DocumentType): string;
    getDocumentTypeNodePublicId(doctypeNode: _.DocumentType): string;
    getDocumentTypeNodeSystemId(doctypeNode: _.DocumentType): string;
    isTextNode(node: _.Node): boolean;
    isCommentNode(node: _.Node): boolean;
    isDocumentTypeNode(node: _.Node): boolean;
    isElementNode(node: _.Node): boolean;
    private processAttributes(element, attrs);
    private createTextNode(text);
    private createExpressionNode(expression);
}
