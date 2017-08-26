import { IPlatform } from '@slicky/core';
import { ApplicationTemplate, BaseTemplate, Template } from '@slicky/templates-runtime';
export declare class TemplatesProvider {
    private platform;
    private applicationTemplate;
    constructor(platform: IPlatform, applicationTemplate: ApplicationTemplate);
    createFrom(hash: number, parent: BaseTemplate): Template;
}
