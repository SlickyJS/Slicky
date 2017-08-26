import {Component, Input, Output, OnInit, OnDestroy} from '@slicky/core';
import {EventEmitter} from '@slicky/event-emitter';
import {Todo} from './todo';


@Component({
	selector: 'li[todo]',
	template: require('./todoComponentTemplate.html'),
})
export class TodoComponent implements OnInit, OnDestroy
{


	@Input()
	public todo: Todo;

	@Output()
	public removed = new EventEmitter<Todo>();

	@Output()
	public updating = new EventEmitter<Todo>();

	@Output()
	public toggled = new EventEmitter<Todo>();

	public hoveringDone: boolean = false;


	public onInit(): void
	{
		console.log(`Initialized todo "${this.todo.text}"`);
	}


	public onDestroy(): void
	{
		console.log(`Destroyed todo "${this.todo.text}"`);
	}


	public remove(): void
	{
		this.removed.emit(this.todo);
	}


	public update(): void
	{
		this.updating.emit(this.todo);
	}


	public toggle(): void
	{
		this.todo.toggle();
		this.toggled.emit(this.todo);
	}

}
