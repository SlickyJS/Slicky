export declare enum IterableChangeAction {
    Add = 0,
    Remove = 1,
}
export interface IterableProperty<V> {
    action: IterableChangeAction;
    value: V;
}
export interface IterableChanges<V> {
    forEachAllActions: (iterator: (property: IterableProperty<V>) => void) => void;
    forEachAllAdded: (iterator: (property: IterableProperty<V>) => void) => void;
    forEachAllRemoved: (iterator: (property: IterableProperty<V>) => void) => void;
}
export declare type IterableObject<T> = Array<T> | {
    [key: string]: T;
} | {
    [key: number]: T;
};
export declare class IterableDiffer<T> {
    private record;
    constructor(record: IterableObject<T>);
    check(record: IterableObject<T>): IterableChanges<T>;
    private compare(record);
    private refresh(record);
}
