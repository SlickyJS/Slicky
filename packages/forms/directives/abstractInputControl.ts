import {ElementRef, DirectivesStorageRef, OnInit, OnTemplateInit, Input} from '@slicky/core';
import {merge, forEach} from '@slicky/utils';
import {EventEmitter} from '@slicky/event-emitter';
import {Renderer} from '@slicky/templates/dom';
import {AbstractFormControl} from './abstractFormControl';
import {AbstractInputValueAccessor} from './abstractInputValueAccessor';
import {AbstractValidator, ValidationErrors} from '../validators';


export enum ControlStatus
{
	Valid,
	Invalid,
	Pending,
}


export const ControlStatusClasses = {
	touched: 's-touched',
	untouched: 's-untouched',
	dirty: 's-dirty',
	pristine: 's-pristine',
	pending: 's-pending',
	valid: 's-valid',
	invalid: 's-invalid',
};


export abstract class AbstractInputControl<T, U extends HTMLElement> extends AbstractFormControl<T, U> implements OnInit, OnTemplateInit
{


	@Input()
	public name: string;

	public onChange = new EventEmitter<T>();

	private renderer: Renderer;

	protected el: ElementRef<U>;

	private directives: DirectivesStorageRef;

	private valueAccessor: AbstractInputValueAccessor<T, U>;

	private validators: Array<AbstractValidator<any>>;

	private status: ControlStatus;

	private _errors: ValidationErrors = {};

	private _value: T;

	private initValue: T;

	private _touched: boolean = false;


	constructor(renderer: Renderer, el: ElementRef<U>, directives: DirectivesStorageRef)
	{
		super();

		this.renderer = renderer;
		this.el = el;
		this.directives = directives;
	}


	get value(): T
	{
		return this._value;
	}


	set value(value: T)
	{
		this.initValue = value;
		this.refresh(value);
		this.valueAccessor.setValue(value);
	}


	get valid(): boolean
	{
		return this.status === ControlStatus.Valid;
	}


	get invalid(): boolean
	{
		return this.status === ControlStatus.Invalid;
	}


	get pending(): boolean
	{
		return this.status === ControlStatus.Pending;
	}


	get dirty(): boolean
	{
		return this._value !== this.initValue;
	}


	get pristine(): boolean
	{
		return this._value === this.initValue;
	}


	get touched(): boolean
	{
		return this._touched;
	}


	get errors(): ValidationErrors
	{
		return this._errors;
	}


	public reset(): void
	{
		this.valueAccessor.setValue(null);
		this.status = undefined;
		this._touched = false;
		this._errors = {};
	}


	public focus(): void
	{
		this.valueAccessor.focus();
	}


	public onInit(): void
	{
		this.valueAccessor = this.directives.find(<any>AbstractInputValueAccessor);

		if (!this.valueAccessor) {
			const tagName = this.el.nativeElement.nodeName.toLowerCase();
			throw new Error(`AbstractInputControl: missing form value accessor on <${tagName}> element.`);
		}

		this.renderer.addClass(this.el.nativeElement, ControlStatusClasses.untouched);

		this.validators = this.directives.findAll(<any>AbstractValidator);

		this.valueAccessor.onChange.subscribe((value: T) => {
			this.refresh(value);
			this.onChange.emit(value);
		});

		this.valueAccessor.onTouched.subscribe(() => {
			this._touched = true;
			this.renderer.removeClass(this.el.nativeElement, ControlStatusClasses.untouched);
			this.renderer.addClass(this.el.nativeElement, ControlStatusClasses.touched);
		});
	}


	public onTemplateInit(): void
	{
		this.initValue = this.valueAccessor.getValue();
		this.refresh(this.initValue);
	}


	public getElementRef(): ElementRef<U>
	{
		return this.el;
	}


	private refresh(value: T): void
	{
		this._value = value;

		const el = this.el.nativeElement;

		this.renderer.removeClass(el, ControlStatusClasses.pending);
		this.renderer.removeClass(el, ControlStatusClasses.valid);
		this.renderer.removeClass(el, ControlStatusClasses.invalid);
		this.renderer.removeClass(el, ControlStatusClasses.dirty);
		this.renderer.removeClass(el, ControlStatusClasses.pristine);

		this.renderer.addClass(el, this._value === this.initValue ? ControlStatusClasses.pristine : ControlStatusClasses.dirty);

		if (!this.validators.length) {
			this.status = ControlStatus.Valid;
			this._errors = {};
			this.renderer.addClass(this.el.nativeElement, ControlStatusClasses.valid);

			return;
		}

		this.status = ControlStatus.Pending;
		this._errors = {};
		this.renderer.addClass(this.el.nativeElement, ControlStatusClasses.pending);

		const total = this.validators.length;
		let i = 0;

		forEach(this.validators, (validator: AbstractValidator<any>) => {
			validator.validate(this._value, (errors) => {
				i++;

				if (errors !== null) {
					this.status = ControlStatus.Invalid;
					this._errors = merge(this._errors, errors);
					this.renderer.addClass(this.el.nativeElement, ControlStatusClasses.invalid);
				}

				if (i === total) {
					if (this.status === ControlStatus.Pending) {
						this.status = ControlStatus.Valid;
						this.renderer.addClass(this.el.nativeElement, ControlStatusClasses.valid);
					}

					this.renderer.removeClass(this.el.nativeElement, ControlStatusClasses.pending);
				}
			});
		});
	}

}
