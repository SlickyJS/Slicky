import { EmbeddedTemplatesContainer } from '../templates';
export declare class ForHelper {
    private container;
    private item;
    private index;
    private trackBy;
    private templates;
    private differ;
    private items;
    constructor(container: EmbeddedTemplatesContainer, item: string, index?: string, trackBy?: (item: any, index: number) => any);
    destroy(): void;
    check(items: any): void;
    private addItem(key, value);
    private updateItem(key, value);
    private removeItem(key);
    private moveItem(previousKey, key);
    private updateTemplate(template, value, index);
}
