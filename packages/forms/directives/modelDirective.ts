import {Directive, OnInit, OnTemplateInit, OnUpdate, Input, Output, ElementRef, DirectivesStorageRef} from '@slicky/core';
import {EventEmitter} from '@slicky/event-emitter';
import {Observable} from 'rxjs';
import {AbstractInputControl} from './abstractInputControl';
import {ValidationErrors} from '../validators';


export type HTMLFormInputElement = HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement;


@Directive({
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
		return this.control.getValue();
	}


	get valid(): Observable<boolean>
	{
		return new Observable((subscriber) => {
			this.control.isValid((valid) => {
				subscriber.next(valid);
			});
		});
	}


	get errors(): Observable<ValidationErrors>
	{
		return new Observable((subscriber) => {
			this.control.getErrors((errors) => {
				subscriber.next(errors);
			});
		});
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
			this.control.setValue(this._value);
		}
	}


	public onUpdate(input: string, value: T): void
	{
		if (!this.control || input !== 's:model') {
			return;
		}

		this.control.setValue(value);
	}

}
