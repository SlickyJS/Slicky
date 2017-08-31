import { Translator, ParametersList } from '@slicky/translator';
export declare class ComponentTranslator {
    private translator;
    constructor(translator: Translator);
    translate(message: any, countOrParameters?: number | ParametersList, parameters?: ParametersList): string;
}
