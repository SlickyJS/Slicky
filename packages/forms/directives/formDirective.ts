import {Directive, HostEvent, Output} from '@slicky/core';
import {EventEmitter} from '@slicky/event-emitter';
import {forEach, find, exists} from '@slicky/utils';
import {AbstractInputControl} from './abstractInputControl';
import {ValidationErrors} from '../validators';


@Directive({
	selector: 'form',
	exportAs: 'sForm',
})
export class FormDirective<T>
{


	@Output('s:submit')
	public submitted = new EventEmitter<any>();

	private controls: Array<AbstractInputControl<any, any>> = [];


	get values(): T
	{
		const values = {};

		this.eachControl((control) =>  {
			values[control.name] = control.value;
		});

		return <T>values;
	}


	set values(values: T)
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


	public get(name: string): AbstractInputControl<any, any>
	{
		const input = find(this.controls, (control: AbstractInputControl<any, any>) => {
			return control.name === name;
		});

		if (!input) {
			throw new Error(`FormDirective.get: control "${name}" does not exists.`);
		}

		return input;
	}


	@HostEvent('submit')
	public onSubmit(e/*: Event*/): void
	{
		e.preventDefault();

		if (this.valid) {
			this.submitted.emit(this);
		}
	}


	public reset(): void
	{
		this.eachControl((control) => {
			control.reset();
		});
	}


	public registerControl(control: AbstractInputControl<any, any>): void
	{
		if (!control.name) {
			const tagName = control.getElementRef().nativeElement.tagName.toLowerCase();
			throw new Error(`FormDirective: missing "name" attribute on <${tagName}> element.`);
		}

		this.controls.push(control);
	}


	public unregisterControl(control: AbstractInputControl<any, any>): void
	{
		const pos = this.controls.indexOf(control);

		if (pos >= 0) {
			this.controls.splice(pos, 1);
		}
	}


	private eachControl(iterator: (control: AbstractInputControl<any, any>) => void): void
	{
		forEach(this.controls, iterator);
	}

}
