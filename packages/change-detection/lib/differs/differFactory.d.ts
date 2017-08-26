import { DifferInterface, DifferTrackByFn } from './differ';
export declare class DifferFactory {
    create<T>(data: any, trackBy?: DifferTrackByFn<T>): DifferInterface<T>;
}
