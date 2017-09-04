import { EmbeddedTemplatesContainer } from '../templates';
export declare class ForOfHelper {
    private container;
    private item;
    private index;
    private trackBy;
    private templates;
    private differ;
    constructor(container: EmbeddedTemplatesContainer, item: string, index?: string, trackBy?: (item: any, index: number) => any);
    destroy(): void;
    check(items: any): void;
    private addItem(index, item);
    private updateItem(previousIndex, value);
    private removeItem(previousIndex);
    private moveItem(previousIndex, index, value);
    private updateTemplate(template, value, index);
}
