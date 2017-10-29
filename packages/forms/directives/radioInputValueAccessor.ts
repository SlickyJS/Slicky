import {Directive, ElementRef, HostEvent} from '@slicky/core';
import {exists} from '@slicky/utils';
import {AbstractInputValueAccessor} from './abstractInputValueAccessor';
import {DefaultInputValueAccessor} from './defaultInputValueAccessor';


@Directive({
	id: 'sForm:RadioInputValueAccessor',
	selector: 'input[type="radio"]',
	override: DefaultInputValueAccessor,
})
export class RadioInputValueAccessor extends AbstractInputValueAccessor<string, HTMLInputElement>
{


	constructor(el: ElementRef<HTMLInputElement>)
	{
		super(el);
	}


	@HostEvent('change')
	public onInput(): void
	{
		const value = this.getValue();

		if (exists(value)) {
			this.onChange.emit(value);
		}
	}


	@HostEvent('blur')
	public onBlur(): void
	{
		this.onTouched.emit();
	}


	public getValue(): string
	{
		if (this.el.nativeElement.checked) {
			return this.el.nativeElement.value;
		}
	}


	public setValue(value: string): void
	{
		if (this.el.nativeElement.value === value) {
			this.el.nativeElement.checked = true;
		}
	}


	public focus(): void
	{
		this.el.nativeElement.focus();
	}

}
