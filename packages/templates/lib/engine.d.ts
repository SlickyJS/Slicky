import { EventEmitter } from '@slicky/event-emitter';
import { EnginePlugin } from './enginePlugin';
import { EngineProgress } from './engineProgress';
export declare class Engine {
    compiled: EventEmitter<{
        name: string | number;
        code: string;
    }>;
    private plugins;
    constructor();
    addPlugin(plugin: EnginePlugin): void;
    compile(name: string | number, template: string): string;
    private processTree(builder, method, progress, matcher, parent, insertBefore?);
    private processExpression(parent, progress, expression, insertBefore?);
    private processText(parent, text, insertBefore?);
    private processElement(builder, parent, progress, matcher, element, insertBefore?);
    private processElementInclude(builder, parent, progress, element, insertBefore?);
    private processElementTemplate(builder, parent, progress, matcher, element);
    compileExpression(expr: string, progress: EngineProgress, addMissingReturn?: boolean): string;
}
