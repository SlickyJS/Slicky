import { ElementRef, OnUpdate } from '@slicky/core';
export declare class IconDirective implements OnUpdate {
    icon: string;
    el: ElementRef<HTMLElement>;
    constructor(el: ElementRef<HTMLElement>);
    onUpdate(input: string, value: any): void;
}
