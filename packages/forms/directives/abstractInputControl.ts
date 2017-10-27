import {ElementRef, DirectivesStorageRef, OnInit, OnTemplateInit, OnAttach, OnDestroy, Input} from '@slicky/core';
import {merge, forEach, exists} from '@slicky/utils';
import {EventEmitter} from '@slicky/event-emitter';
import {AbstractInputValueAccessor} from './abstractInputValueAccessor';
import {FormDirective} from './formDirective';
import {AbstractValidator, ValidationErrors} from '../validators';


export enum ControlState
{
	Valid,
	Invalid,
	Pending,
}


export abstract class AbstractInputControl<T, U extends Element> implements OnInit, OnTemplateInit, OnAttach, OnDestroy
{


	@Input()
	public name: string;

	public onChange = new EventEmitter<T>();

	protected el: ElementRef<U>;

	private directives: DirectivesStorageRef;

	private valueAccessor: AbstractInputValueAccessor<T, U>;

	private validators: Array<AbstractValidator<any>>;

	private parent: FormDirective<any>;

	private status: ControlState;

	private _errors: ValidationErrors;

	private _value: T;


	constructor(el: ElementRef<U>, directives: DirectivesStorageRef)
	{
		this.el = el;
		this.directives = directives;
	}


	get value(): T
	{
		return this._value;
	}


	set value(value: T)
	{
		this.status = undefined;
		this._errors = undefined;
		this._value = value;
		this.doValidate();
		this.valueAccessor.setValue(value);
	}


	get valid(): boolean
	{
		return this.status === ControlState.Valid;
	}


	get invalid(): boolean
	{
		return this.status === ControlState.Invalid;
	}


	get pending(): boolean
	{
		return this.status === ControlState.Pending;
	}


	get errors(): ValidationErrors
	{
		return this._errors;
	}


	public reset(): void
	{
		this.valueAccessor.setValue(null);
	}


	public onInit(): void
	{
		this.validators = this.directives.findAll(<any>AbstractValidator);
		this.valueAccessor = this.directives.find(<any>AbstractInputValueAccessor);

		this.valueAccessor.onChange.subscribe((value: T) => {
			this.status = undefined;
			this._errors = undefined;
			this._value = value;

			this.doValidate();
			this.onChange.emit(value);
		});
	}


	public onTemplateInit(): void
	{
		this._value = this.valueAccessor.getValue();
		this.doValidate();
	}


	public onAttach(parent): void
	{
		if (this.parent) {
			return;
		}

		if (parent instanceof FormDirective) {
			this.parent = parent;
			this.parent.registerControl(this);
		}
	}


	public onDestroy(): void
	{
		if (this.parent) {
			this.parent.unregisterControl(this);
		}
	}


	public getElementRef(): ElementRef<U>
	{
		return this.el;
	}


	private doValidate(): void
	{
		if (exists(this.status)) {
			return;
		}

		if (!this.validators.length) {
			this.status = ControlState.Valid;
			this._errors = {};

			return;
		}

		this.status = ControlState.Pending;
		this._errors = {};

		const total = this.validators.length;
		let i = 0;

		forEach(this.validators, (validator: AbstractValidator<any>) => {
			validator.validate(this._value, (errors) => {
				i++;

				if (errors !== null) {
					this.status = ControlState.Invalid;
					this._errors = merge(this._errors, errors);
				}

				if (i === total) {
					if (this.status === ControlState.Pending) {
						this.status = ControlState.Valid;
					}
				}
			});
		});
	}

}
