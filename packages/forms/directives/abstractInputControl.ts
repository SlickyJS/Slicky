import {ElementRef, DirectivesStorageRef, OnInit, OnTemplateInit} from '@slicky/core';
import {isBoolean, merge, forEach, isObject} from '@slicky/utils';
import {EventEmitter} from '@slicky/event-emitter';
import {AbstractInputValueAccessor} from './abstractInputValueAccessor';
import {AbstractValidator, ValidationErrors} from '../validators';


export abstract class AbstractInputControl<T, U extends Element> implements OnInit, OnTemplateInit
{


	public onChange = new EventEmitter<T>();

	protected el: ElementRef<U>;

	private directives: DirectivesStorageRef;

	private valueAccessor: AbstractInputValueAccessor<T, U>;

	private validators: Array<AbstractValidator<any>>;

	private _valid: boolean;

	private _errors: ValidationErrors;

	private _value: T;


	constructor(el: ElementRef<U>, directives: DirectivesStorageRef)
	{
		this.el = el;
		this.directives = directives;
	}


	public getValue(): T
	{
		return this._value;
	}


	public setValue(value: T): void
	{
		this._valid = undefined;
		this._errors = undefined;
		this._value = value;
		this.valueAccessor.setValue(value);
	}


	public isValid(cb: (valid: boolean) => void): void
	{
		this.doValidate(() => {
			cb(this._valid);
		});
	}


	public getErrors(cb: (errors: ValidationErrors) => void): void
	{
		this.doValidate(() => {
			cb(this._errors);
		});
	}


	public onInit(): void
	{
		this.validators = this.directives.findAll(<any>AbstractValidator);
		this.valueAccessor = this.directives.find(<any>AbstractInputValueAccessor);

		this.valueAccessor.onChange.subscribe((value: T) => {
			this._valid = undefined;
			this._errors = undefined;
			this._value = value;

			this.onChange.emit(value);
		});
	}


	public onTemplateInit(): void
	{
		this._value = this.valueAccessor.getValue();
	}


	private doValidate(cb: () => void): void
	{
		if (isBoolean(this._valid) && isObject(this._errors)) {
			cb();
		} else {
			this._valid = true;
			this._errors = {};

			const total = this.validators.length;
			let i = 0;

			forEach(this.validators, (validator: AbstractValidator<any>) => {
				validator.validate(this._value, (errors) => {
					i++;

					if (errors !== null) {
						this._valid = false;
						this._errors = merge(this._errors, errors);
					}

					if (i === total) {
						cb();
					}
				});
			});
		}
	}

}
