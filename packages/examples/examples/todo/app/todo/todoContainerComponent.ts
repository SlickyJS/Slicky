import {Component, HostElement, OnInit} from '@slicky/core';
import {List} from 'immutable';
import {Todo} from './todo';
import {TodoComponent} from './todoComponent';


@Component({
	selector: 'todos',
	template: require('./todoContainerComponentTemplate.html'),
	directives: [TodoComponent],
})
export class TodoContainerComponent implements OnInit
{


	@HostElement('input[type="text"]')
	public inputText: HTMLInputElement;


	public currentTodo: Todo = new Todo('');

	public todos: List<Todo> = List();

	private updating: Todo = null;


	public onInit(): void
	{
		this.inputText.focus();
	}


	public saveTodo(): void
	{
		if (this.updating) {
			this.todos = this.todos.update(this.todos.keyOf(this.updating), (todo: Todo) => todo.update(this.currentTodo));
			this.updating = null;

		} else {
			this.todos = this.todos.push(this.currentTodo);
		}

		this.currentTodo = new Todo('');
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
		this.currentTodo = this.updating.clone();
		this.inputText.focus();
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

}
