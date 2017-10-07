import { ElementRef } from '@slicky/core';
import { EventEmitter } from '@slicky/event-emitter';
import { Todo } from '../todo';
export declare class TodoComponent {
    todo: Todo;
    removed: EventEmitter<Todo>;
    updating: EventEmitter<Todo>;
    toggled: EventEmitter<Todo>;
    hoveringDone: boolean;
    private el;
    constructor(el: ElementRef<HTMLLIElement>);
    remove(): void;
    update(): void;
    toggle(): void;
}
