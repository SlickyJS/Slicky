import { DirectiveMetadataLoader, DirectiveDefinition } from '@slicky/core';
import { ClassType } from '@slicky/lang';
import { Container } from '@slicky/di';
export declare class DirectivesProvider {
    private directives;
    constructor(metadataLoader: DirectiveMetadataLoader);
    getDirectiveTypeByHash(hash: number): ClassType<any>;
    getDirectiveMetadataByHash(hash: number): DirectiveDefinition;
    create(hash: number, el: HTMLElement, container: Container): any;
}
