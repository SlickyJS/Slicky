import { Container } from '@slicky/di';
import { ClassType } from '@slicky/lang';
import { AbstractExtension } from '@slicky/core';
import { PlatformInterface } from '../platform';
export interface ApplicationOptions {
    directives?: Array<ClassType<any>>;
}
export declare class Application {
    private container;
    private metadataLoader;
    private extensions;
    private directives;
    constructor(container: Container, options?: ApplicationOptions);
    addExtension(extension: AbstractExtension): void;
    getDirectives(): Array<ClassType<any>>;
    run(platform: PlatformInterface, el: HTMLElement): void;
}
