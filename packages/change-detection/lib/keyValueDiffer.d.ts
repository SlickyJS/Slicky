import { DifferInterface } from './differInterface';
export declare enum KeyValueChangeAction {
    Add = 0,
    Update = 1,
    Remove = 2,
    Move = 3,
}
export interface KeyValueTrackByFunction<K, V> {
    (item: V, index: K): any;
}
export interface KeyValueProperty<K, V> {
    action: KeyValueChangeAction;
    property: K;
    newValue: V;
    oldValue: V;
}
export interface KeyValueChanges<K, V> {
    size: number;
    forEachAllActions: (iterator: (property: KeyValueProperty<K, V>) => void) => void;
    forEachAllAdded: (iterator: (property: KeyValueProperty<K, V>) => void) => void;
    forEachAllUpdated: (iterator: (property: KeyValueProperty<K, V>) => void) => void;
    forEachAllRemoved: (iterator: (property: KeyValueProperty<K, V>) => void) => void;
    forEachAllMoved: (iterator: (property: KeyValueProperty<K, V>) => void) => void;
}
export declare type KeyValueObject<T> = Array<T> | {
    [key: string]: T;
} | {
    [key: number]: T;
};
export declare class KeyValueDiffer<K, V> implements DifferInterface {
    private trackBy;
    private properties;
    constructor(record: KeyValueObject<V>, trackBy?: KeyValueTrackByFunction<K, V>);
    check(record: KeyValueObject<V>): KeyValueChanges<K, V>;
    private compare(record);
    private getCurrentProperty(record, property);
    private getPreviousProperty(key, value);
    private storeCurrentRecord(record);
}
