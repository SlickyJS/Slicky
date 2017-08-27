import { EventEmitter } from '@slicky/event-emitter';
export declare class ChildrenDirectivesStorage<T> {
    add: EventEmitter<T>;
    remove: EventEmitter<T>;
}
