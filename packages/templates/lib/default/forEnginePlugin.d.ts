import { EnginePlugin, OnProcessTemplateArgument } from '../enginePlugin';
export declare class ForEnginePlugin extends EnginePlugin {
    onProcessTemplate(arg: OnProcessTemplateArgument): void;
    private parseFor(loop);
}
