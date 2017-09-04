export declare type DifferTrackByFn<T> = (item: T, index: number) => any;
export declare enum DifferAction {
    Add = 0,
    Update = 1,
    Remove = 2,
    Move = 3,
}
export interface DifferChange<T> {
    action: DifferAction;
    previousIndex: number;
    previousItem: T;
    currentIndex: number;
    currentItem: T;
}
export interface DifferInterface<T> {
    check(data: any): Array<DifferChange<T>>;
}
