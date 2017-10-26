import {Directive, OnInit, OnUpdate, Input, Output, ElementRef, DirectivesStorageRef} from '@slicky/core';
import {EventEmitter} from '@slicky/event-emitter';
import {isBoolean, merge, forEach, isObject, exists} from '@slicky/utils';
import {Observable} from 'rxjs';
import {AbstractInputValueAccessor} from './abstractInputValueAccessor';
import {AbstractValidator, ValidationErrors} from '../validators';


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

	private validators: Array<AbstractValidator<any>>;

	private _valid: boolean;

	private _errors: ValidationErrors;


	constructor(el: ElementRef<HTMLFormInputElement>, directives: DirectivesStorageRef)
	{
		this.el = el;
		this.directives = directives;
	}


	get value(): T
	{
		return this._value;
	}


	get valid(): Observable<boolean>
	{
		return new Observable((subscriber) => {
			this.loadErrors(() => {
				subscriber.next(this._valid);
			});
		});
	}


	get errors(): Observable<ValidationErrors>
	{
		return new Observable((subscriber) => {
			this.loadErrors(() => {
				subscriber.next(this._errors);
			});
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

		if (<any>this._value === '') {
			this._value = this.valueAccessor.getValue();
		} else {
			this.valueAccessor.setValue(this._value);
		}

	}


	public onUpdate(input: string, value: T): void
	{
		if (!this.valueAccessor || input !== 's:model') {
			return;
		}

		this._valid = undefined;
		this._errors = undefined;

		this.valueAccessor.setValue(value);
	}


	private loadErrors(cb: () => void): void
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
