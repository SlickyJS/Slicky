export declare class ElementRef {
    private document;
    nativeElement: HTMLElement;
    constructor(nativeElement: HTMLElement);
    addElement(elementName: string, attributes?: {
        [name: string]: string;
    }, fn?: (parent: ElementRef) => void): void;
    addText(text: string, fn?: (text: Text) => void): void;
}
