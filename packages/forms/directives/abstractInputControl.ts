import {ElementRef, DirectivesStorageRef, OnInit, OnTemplateInit} from '@slicky/core';
import {isFunction, merge, forEach, exists} from '@slicky/utils';
import {EventEmitter} from '@slicky/event-emitter';
import {AbstractInputValueAccessor} from './abstractInputValueAccessor';
import {AbstractValidator, ValidationErrors} from '../validators';


export enum ControlState
{
	Valid,
	Invalid,
	Pending,
}


export abstract class AbstractInputControl<T, U extends Element> implements OnInit, OnTemplateInit
{


	public onChange = new EventEmitter<T>();

	protected el: ElementRef<U>;

	private directives: DirectivesStorageRef;

	private valueAccessor: AbstractInputValueAccessor<T, U>;

	private validators: Array<AbstractValidator<any>>;

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


	public setValue(value: T): void
	{
		this.status = undefined;
		this._errors = undefined;
		this._value = value;
		this.doValidate();
		this.valueAccessor.setValue(value);
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


	private doValidate(cb?: () => void): void
	{
		if (exists(this.status)) {
			if (isFunction(cb)) {
				cb();
			}
		} else {
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

						if (isFunction(cb)) {
							cb();
						}
					}
				});
			});
		}
	}

}
