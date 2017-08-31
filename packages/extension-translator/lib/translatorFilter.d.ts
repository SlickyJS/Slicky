import { FilterInterface } from '@slicky/core';
import { ParametersList } from '@slicky/translator';
import { ComponentTranslator } from './componentTranslator';
export declare class TranslatorFilter implements FilterInterface {
    private translator;
    constructor(translator: ComponentTranslator);
    transform(message: any, countOrParameters?: number | ParametersList, parameters?: ParametersList): string;
}
