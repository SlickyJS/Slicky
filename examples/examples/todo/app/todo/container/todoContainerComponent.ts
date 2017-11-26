import {Component, OnTemplateInit, ChildDirective} from '@slicky/core';
import {FormModule, FormDirective} from '@slicky/forms';
import {AbstractInputControl} from '@slicky/forms/directives';
import {List} from 'immutable';
import {Todo, DEFAULT_TODO_COLOR} from '../todo';
import {TodoComponent, } from '../item/todoComponent';
import {TODOS_CONTAINER_TRANSLATIONS} from './translations';
import {IconDirective} from '../../helpers';
import {JsonFilter} from '../../filters';


declare interface FormValues
{
	text?: string,
	color?: string,
}


@Component({
	selector: 'todo-container',
	template: require('./template.html'),
	styles: [
		require('./style.css'),
	],
	modules: [FormModule],
	directives: [TodoComponent, IconDirective],
	filters: [JsonFilter],
	translations: TODOS_CONTAINER_TRANSLATIONS,
})
export class TodoContainerComponent implements OnTemplateInit
{


	@ChildDirective(FormDirective)
	public form: FormDirective<FormValues>;

	public todos: List<Todo> = List<Todo>();

	public todoFilter: (todo: Todo) => boolean;

	private updating: Todo = null;


	constructor()
	{
		this.showAllTodos();
	}


	public onTemplateInit(): void
	{
		this.form.values = {
			color: DEFAULT_TODO_COLOR,
		};

		this.focusTextInput();
	}


	public saveTodo(): void
	{
		if (this.updating) {
			this.todos = this.todos.update(this.todos.keyOf(this.updating), (todo: Todo) => todo.update(this.form.values.text, this.form.values.color));
			this.updating = null;

		} else {
			this.todos = this.todos.push(new Todo(this.form.values.text, this.form.values.color));
		}

		this.form.values = {
			text: null,
			color: DEFAULT_TODO_COLOR,
		};

		this.focusTextInput();
	}


	public removeTodo(todo: Todo): void
	{
		this.todos = this.todos.delete(this.todos.keyOf(todo));
		this.focusTextInput();
	}


	public updateTodo(todo: Todo): void
	{
		this.updating = todo;
		this.form.values = {
			text: todo.text,
			color: todo.color,
		};

		this.focusTextInput();
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


	private focusTextInput(): void
	{
		(<AbstractInputControl<any, any>>this.form.get('text')).focus();
	}

}
