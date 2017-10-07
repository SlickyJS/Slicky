import { FilterInterface } from '@slicky/core';
export declare class TimeAgoInWords implements FilterInterface {
    transform(value: Date, ...args: Array<any>): string;
}
