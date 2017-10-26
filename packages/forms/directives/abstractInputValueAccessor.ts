import {ElementRef} from '@slicky/core';
import {EventEmitter} from '@slicky/event-emitter';


export abstract class AbstractInputValueAccessor<T, U extends Element>
{


	public onChange = new EventEmitter<T>();

	protected el: ElementRef<U>;


	constructor(el: ElementRef<U>)
	{
		this.el = el;
	}


	public abstract getValue(): T|null;


	public abstract setValue(value: T|null): void;

}
