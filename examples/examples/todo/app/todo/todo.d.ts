export declare const DEFAULT_TODO_COLOR: string;
export declare class Todo {
    static TEXT_LIGHT: string;
    static TEXT_DARK: string;
    id: number;
    done: boolean;
    text: string;
    color: string;
    textColor: string;
    createdAt: Date;
    constructor(text: string, color?: string);
    toggle(): void;
    update(text: string, color: string): Todo;
    private setColor(color);
}
