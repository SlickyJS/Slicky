import { EmbeddedTemplatesContainer } from '../templates';
export declare class IfHelper {
    private container;
    private current;
    constructor(container: EmbeddedTemplatesContainer);
    destroy(): void;
    check(value: any): void;
}
