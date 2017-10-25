import {Directive, OnInit, OnUpdate, Input, Output, ElementRef, DirectivesStorageRef} from '@slicky/core';
import {EventEmitter} from '@slicky/event-emitter';
import {AbstractInputValueAccessor} from './abstractInputValueAccessor';


export type HTMLFormInputElement = HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement;


@Directive({
	selector: '[s:model]',
	exportAs: 'sModel',
})
export class ModelDirective<T, U extends Element> implements OnInit, OnUpdate
{


	@Input('s:model')
	public _value: T;

	@Output('s:model-change')
	public onChange = new EventEmitter<T>();

	private el: ElementRef<HTMLFormInputElement>;

	private directives: DirectivesStorageRef;

	private valueAccessor: AbstractInputValueAccessor<T, U>;


	constructor(el: ElementRef<HTMLFormInputElement>, directives: DirectivesStorageRef)
	{
		this.el = el;
		this.directives = directives;
	}


	public onInit(): void
	{
		this.valueAccessor = this.directives.find(<any>AbstractInputValueAccessor);
		this.valueAccessor.setValue(this._value);
		this.valueAccessor.onChange.subscribe((value: T) => {
			this._value = value;
			this.onChange.emit(value);
		});
	}


	public onUpdate(input: string, value: T): void
	{
		if (!this.valueAccessor || input !== 's:model') {
			return;
		}

		this.valueAccessor.setValue(value);
	}


	get value(): T
	{
		return this._value;
	}

}
