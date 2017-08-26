import { DifferInterface, DifferTrackByFn, DifferChange } from './differ';
export declare class ListDiffer<T> implements DifferInterface<T> {
    private copy;
    private trackBy;
    constructor(list: Array<T>, trackBy?: DifferTrackByFn<T>);
    check(list: Array<T>): Array<DifferChange<T>>;
    private findInItems(items, trackBy);
}
