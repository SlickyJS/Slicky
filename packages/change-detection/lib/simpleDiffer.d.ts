import { DifferInterface } from './differInterface';
export interface SimpleDifferChange<T> {
    newValue: T;
    oldValue: T;
}
export declare class SimpleDiffer<T> implements DifferInterface {
    private record;
    constructor(record: T);
    check(record: T): SimpleDifferChange<T>;
    private refresh(record);
}
