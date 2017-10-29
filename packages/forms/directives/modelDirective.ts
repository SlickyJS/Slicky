import {Directive, OnInit, OnTemplateInit, OnUpdate, Input, Output, ElementRef, DirectivesStorageRef} from '@slicky/core';
import {EventEmitter} from '@slicky/event-emitter';
import {AbstractInputControl} from './abstractInputControl';
import {ValidationErrors} from '../validators';


export type HTMLFormInputElement = HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement;


@Directive({
	id: 'sForm:ModelDirective',
	selector: '[s:model]',
	exportAs: 'sModel',
})
export class ModelDirective<T, U extends Element> implements OnInit, OnTemplateInit, OnUpdate
{


	@Input('s:model')
	public _value: T;

	@Output('s:model-change')
	public onChange = new EventEmitter<T>();

	private el: ElementRef<HTMLFormInputElement>;

	private directives: DirectivesStorageRef;

	private control: AbstractInputControl<T, U>;


	constructor(el: ElementRef<HTMLFormInputElement>, directives: DirectivesStorageRef)
	{
		this.el = el;
		this.directives = directives;
	}


	get value(): T
	{
		return this.control.value;
	}


	set value(value: T)
	{
		this.control.value = value;
	}


	get valid(): boolean
	{
		return this.control.valid;
	}


	get invalid(): boolean
	{
		return this.control.invalid;
	}


	get pending(): boolean
	{
		return this.control.pending;
	}


	get dirty(): boolean
	{
		return this.control.dirty;
	}


	get pristine(): boolean
	{
		return this.control.pristine;
	}


	get touched(): boolean
	{
		return this.control.touched;
	}


	get errors(): ValidationErrors
	{
		return this.control.errors;
	}


	public onInit(): void
	{
		this.control = this.directives.find(<any>AbstractInputControl);
		this.control.onChange.subscribe((value) => {
			this.onChange.emit(value);
		});
	}


	public onTemplateInit(): void
	{
		// here because we need to have access to inner <option> elements
		if (this._value) {
			this.control.value = this._value;
		}
	}


	public onUpdate(input: string, value: T): void
	{
		if (!this.control || input !== 's:model') {
			return;
		}

		this.control.value = value;
	}


	public focus(): void
	{
		this.control.focus();
	}


	public reset(): void
	{
		this.control.reset();
	}

}
