import {ElementRef, Input} from '@slicky/core';
import {forEach, find, exists} from '@slicky/utils';
import {AbstractFormControl} from './abstractFormControl';
import {AbstractInputControl} from './abstractInputControl';
import {ValidationErrors} from '../validators';


export abstract class AbstractFormContainerDirective<T> extends AbstractFormControl<T, any>
{


	@Input()
	public name: string;

	public _isSlickyFormContainerDirective: boolean = true;

	private el: ElementRef<any>;

	private controls: Array<AbstractFormControl<any, any>> = [];


	constructor(el: ElementRef<any>)
	{
		super();

		this.el = el;
	}


	get values(): T
	{
		return this.value;
	}


	set values(values: T)
	{
		this.value = values;
	}


	get value(): T
	{
		const values = {};

		this.eachControl((control) =>  {
			values[control.name] = control.value;
		});

		return <any>values;
	}


	set value(values: T)
	{
		this.eachControl((control) => {
			if (exists(values[control.name])) {
				control.value = values[control.name];
			}
		});
	}


	get valid(): boolean
	{
		let valid = true;

		this.eachControl((control) =>  {
			if (!control.valid) {
				valid = false;
			}
		});

		return valid;
	}


	get errors(): ValidationErrors
	{
		const errors = {};

		this.eachControl((control) =>  {
			errors[control.name] = control.errors;
		});

		return errors;
	}


	public get(name: string): AbstractFormControl<any, any>|AbstractInputControl<any, any>
	{
		const input = find(this.controls, (control: AbstractFormControl<any, any>) => {
			return control.name === name;
		});

		if (!input) {
			throw new Error(`FormContainerDirective.get: control "${name}" does not exists.`);
		}

		return input;
	}


	public reset(): void
	{
		this.eachControl((control) => {
			control.reset();
		});
	}


	public getElementRef(): ElementRef<any>
	{
		return this.el;
	}


	public registerControl(control: AbstractFormControl<T, any>): void
	{
		if (!control.name) {
			const tagName = control.getElementRef().nativeElement.tagName.toLowerCase();
			throw new Error(`FormDirective: missing "name" attribute on <${tagName}> element.`);
		}

		this.controls.push(control);
	}


	public unregisterControl(control: AbstractFormControl<T, any>): void
	{
		const pos = this.controls.indexOf(control);

		if (pos >= 0) {
			this.controls.splice(pos, 1);
		}
	}


	private eachControl(iterator: (control: AbstractFormControl<T, any>) => void): void
	{
		forEach(this.controls, iterator);
	}

}
