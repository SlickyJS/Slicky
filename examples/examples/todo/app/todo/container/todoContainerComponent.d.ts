import { OnInit } from '@slicky/core';
import { List } from 'immutable';
import { Todo } from '../todo';
export declare class TodoContainerComponent implements OnInit {
    inputText: HTMLInputElement;
    currentText: string;
    currentColor: string;
    todos: List<Todo>;
    todoFilter: (todo: Todo) => boolean;
    private updating;
    constructor();
    onInit(): void;
    saveTodo(): void;
    removeTodo(todo: Todo): void;
    updateTodo(todo: Todo): void;
    removeDone(): void;
    todoTrackByFn(todo: Todo): number;
    todoSort(a: Todo, b: Todo): number;
    showAllTodos(): void;
    showOnlyActiveTodos(): void;
    showOnlyDoneTodos(): void;
}
