import {Component, Input, Output, OnInit, OnDestroy, OnUpdate, ElementRef} from '@slicky/core';
import {EventEmitter} from '@slicky/event-emitter';
import {Todo} from './todo';
import {IconDirective} from '../helpers';


@Component({
	selector: 'li[todo]',
	template: require('./todoComponentTemplate.html'),
	directives: [IconDirective],
})
export class TodoComponent implements OnInit, OnDestroy, OnUpdate
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

	private el: ElementRef;


	constructor(el: ElementRef)
	{
		this.el = el;
	}


	public onInit(): void
	{
		console.log(`TodoComponent: initialized todo "${this.todo.text}" in:`);
		console.log(this.el.nativeElement);
	}


	public onDestroy(): void
	{
		console.log(`TodoComponent: destroyed todo "${this.todo.text}"`);
	}


	public onUpdate(input: string, value: any): void
	{
		console.log(`TodoComponent: updated "${input}" with:`);
		console.log(value);
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
