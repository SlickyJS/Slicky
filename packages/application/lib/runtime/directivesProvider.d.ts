import { DirectiveMetadataLoader, DirectiveDefinition, ExtensionsManager } from '@slicky/core';
import { ClassType } from '@slicky/lang';
import { Container } from '@slicky/di';
export declare class DirectivesProvider {
    private extensions;
    private directives;
    constructor(extensions: ExtensionsManager, metadataLoader: DirectiveMetadataLoader);
    getDirectiveTypeByHash(hash: number): ClassType<any>;
    getDirectiveMetadataByHash(hash: number): DirectiveDefinition;
    create(hash: number, el: HTMLElement, container: Container, setup?: (directive: any) => void): any;
}
