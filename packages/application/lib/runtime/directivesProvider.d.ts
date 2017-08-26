import { DirectiveMetadataLoader } from '@slicky/core';
import { ClassType } from '@slicky/lang';
export declare class DirectivesProvider {
    private directives;
    constructor(metadataLoader: DirectiveMetadataLoader);
    getDirectiveTypeByHash(hash: number): ClassType<any>;
}
