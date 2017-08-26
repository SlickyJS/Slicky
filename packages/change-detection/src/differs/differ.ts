export declare type DifferTrackByFn<T> = (item: T, index: number) => any;


export enum DifferAction
{
	Add,
	Update,
	Remove,
	Move,
}


export declare interface DifferChange<T>
{
	action: DifferAction;
	previousIndex: number;
	previousItem: T;
	currentIndex: number;
	currentItem: T;
}


export interface DifferInterface<T>
{


	check(data: any): Array<DifferChange<T>>;

}
