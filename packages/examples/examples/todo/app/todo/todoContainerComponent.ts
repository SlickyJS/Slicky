import {Component, HostElement, OnInit} from '@slicky/core';
import {List} from 'immutable';
import {Todo, DEFAULT_TODO_COLOR} from './todo';
import {TodoComponent, } from './todoComponent';
import {IconDirective} from '../helpers';


@Component({
	selector: 'todos',
	template: require('./todoContainerComponentTemplate.html'),
	directives: [TodoComponent, IconDirective],
})
export class TodoContainerComponent implements OnInit
{


	@HostElement('input[type="text"]')
	public inputText: HTMLInputElement;


	public currentText: string = '';

	public currentColor: string = DEFAULT_TODO_COLOR;

	public todos: List<Todo> = List();

	public todoFilter: (todo: Todo) => boolean;

	private updating: Todo = null;


	constructor()
	{
		this.showAllTodos();
	}


	public onInit(): void
	{
		this.inputText.focus();
	}


	public saveTodo(): void
	{
		if (this.updating) {
			this.todos = this.todos.update(this.todos.keyOf(this.updating), (todo: Todo) => todo.update(this.currentText, this.currentColor));
			this.updating = null;

		} else {
			this.todos = this.todos.push(new Todo(this.currentText, this.currentColor));
		}

		this.currentText = '';
		this.currentColor = DEFAULT_TODO_COLOR;

		this.inputText.focus();
	}


	public removeTodo(todo: Todo): void
	{
		this.todos = this.todos.delete(this.todos.keyOf(todo));
		this.inputText.focus();
	}


	public updateTodo(todo: Todo): void
	{
		this.updating = todo;
		this.currentText = todo.text;
		this.currentColor = todo.color;

		this.inputText.focus();
	}


	public removeDone(): void
	{
		this.todos = <List<Todo>>this.todos.filter((todo) => !todo.done);
	}


	public todoTrackByFn(todo: Todo): number
	{
		return todo.id;
	}


	public todoSort(a: Todo, b: Todo): number
	{
		if (a.done && !b.done) {
			return -1;
		}

		if (!a.done && b.done) {
			return 1;
		}

		return 0;
	}


	public showAllTodos(): void
	{
		this.todoFilter = () => true;
	}


	public showOnlyActiveTodos(): void
	{
		this.todoFilter = (todo) => !todo.done;
	}


	public showOnlyDoneTodos(): void
	{
		this.todoFilter = (todo) => todo.done;
	}

}
