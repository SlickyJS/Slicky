import { BaseTemplate } from './baseTemplate';
import { ApplicationTemplate } from './applicationTemplate';
import { Template } from './template';
export declare abstract class RenderableTemplate extends BaseTemplate {
    _refreshing: number;
    nodes: Array<Node>;
    protected root: Template;
    protected initialized: boolean;
    private listeners;
    constructor(application: ApplicationTemplate, parent?: BaseTemplate, root?: Template);
    refresh(): void;
    init(): void;
    destroy(): void;
    getFirstNode(): Node;
    protected _appendComment(parent: HTMLElement, comment: string, fn?: (comment: Comment) => void): void;
    protected _insertCommentBefore(before: Node, comment: string, fn?: (comment: Comment) => void): void;
    protected _appendText(parent: HTMLElement, text: string, fn?: (text: Text) => void): void;
    protected _insertTextBefore(before: Node, text: string, fn?: (text: Text) => void): void;
    protected _appendElement(parent: HTMLElement, elementName: string, attributes?: {
        [name: string]: string;
    }, fn?: (parent: HTMLElement) => void): void;
    protected _insertElementBefore(before: Node, elementName: string, attributes?: {
        [name: string]: string;
    }, fn?: (parent: HTMLElement) => void): void;
    protected _addElementEventListener(element: HTMLElement, eventName: string, callback: EventListenerOrEventListenerObject): void;
    private appendChild(parent, child, fn?);
    private insertChildBefore(before, sibling, fn?);
}
