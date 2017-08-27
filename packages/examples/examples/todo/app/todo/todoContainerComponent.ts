import {Component, HostElement, OnInit, OnDestroy, OnUpdate, ElementRef, ChildDirective, ChildrenDirective, ChildrenDirectivesStorage} from '@slicky/core';
import {List} from 'immutable';
import {Todo} from './todo';
import {TodoComponent} from './todoComponent';
import {IconDirective} from '../helpers';


@Component({
	selector: 'todos',
	template: require('./todoContainerComponentTemplate.html'),
	directives: [TodoComponent, IconDirective],
})
export class TodoContainerComponent implements OnInit, OnDestroy, OnUpdate
{


	@HostElement('input[type="text"]')
	public inputText: HTMLInputElement;

	@ChildDirective(IconDirective)
	public iconDirective: IconDirective;

	@ChildrenDirective(TodoComponent)
	public todoDirectives = new ChildrenDirectivesStorage<TodoComponent>();


	public currentTodo: Todo = new Todo('');

	public todos: List<Todo> = List();

	private el: ElementRef;

	private updating: Todo = null;


	constructor(el: ElementRef)
	{
		this.el = el;
	}


	public onInit(): void
	{
		this.inputText.focus();

		console.log('TodoContainerComponent: initialized in:');
		console.log(this.el.nativeElement);

		console.log('TodoContainerComponent: see IconDirective child directive:');
		console.log(this.iconDirective);

		this.todoDirectives.add.subscribe((todo: TodoComponent) => {
			console.log('TodoContainerComponent: added child directive:');
			console.log(todo);
		});

		this.todoDirectives.remove.subscribe((todo: TodoComponent) => {
			console.log('TodoContainerComponent: removed child directive:');
			console.log(todo);
		});
	}


	public onDestroy(): void
	{
		console.log('TodoContainerComponent: destroyed');
	}


	public onUpdate(input: string, value: any): void
	{
		console.log(`TodoContainerComponent: updated "${input}" with:`);
		console.log(value);
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
