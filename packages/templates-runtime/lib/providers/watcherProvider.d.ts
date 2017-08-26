export interface IWatcherProvider {
    disable(): void;
    check(): void;
    watch(getter: () => any, update: (value: any) => void): void;
}
export declare class DefaultWatcherProvider implements IWatcherProvider {
    private watchers;
    private enabled;
    disable(): void;
    check(): void;
    watch(getter: () => any, update: (value: any) => void): void;
}
