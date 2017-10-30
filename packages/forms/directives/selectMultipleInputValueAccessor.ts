import {Directive, ElementRef, HostEvent} from '@slicky/core';
import {AbstractInputValueAccessor} from './abstractInputValueAccessor';
import {SelectInputValueAccessor} from './selectInputValueAccessor';


@Directive({
	id: 'sForm:SelectMultipleInputValueAccessor',
	selector: 'select[multiple][s:model]',
	override: SelectInputValueAccessor,
})
export class SelectMultipleInputValueAccessor extends AbstractInputValueAccessor<Array<string>, HTMLSelectElement>
{


	constructor(el: ElementRef<HTMLSelectElement>)
	{
		super(el);
	}


	@HostEvent('change')
	public onInput(): void
	{
		this.onChange.emit(this.getValue());
	}


	@HostEvent('blur')
	public onBlur(): void
	{
		this.onTouched.emit();
	}


	public getValue(): Array<string>
	{
		const options = this.el.nativeElement.options;
		const value = [];

		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) {
				value.push(options[i].value);
			}
		}

		return value;
	}


	public setValue(value: Array<string>): void
	{
		const options = this.el.nativeElement.options;

		for (let i = 0; i < options.length; i++) {
			options[i].selected = value.indexOf(options[i].value) >= 0;
		}
	}


	public focus(): void
	{
		this.el.nativeElement.focus();
	}

}
