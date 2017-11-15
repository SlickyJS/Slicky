import {Component, Input, Output, ElementRef} from '@slicky/core';
import {EventEmitter} from '@slicky/event-emitter';
import {Todo} from '../todo';
import {IconDirective, TimeAgoInWordsComponent} from '../../helpers';


@Component({
	selector: 'todo-item',
	template: require('./template.html'),
	styles: [
		require('./styles.css'),
	],
	directives: [IconDirective, TimeAgoInWordsComponent],
})
export class TodoComponent
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

	private el: ElementRef<HTMLLIElement>;


	constructor(el: ElementRef<HTMLLIElement>)
	{
		this.el = el;
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
