import {Directive, ElementRef, HostEvent} from '@slicky/core';
import {AbstractInputValueAccessor} from './abstractInputValueAccessor';
import {DefaultInputValueAccessor} from './defaultInputValueAccessor';


@Directive({
	id: 'sForm:NumberInputValueAccessor',
	selector: 'input[type="number"],input[type="range"]',
	override: DefaultInputValueAccessor,
})
export class NumberInputValueAccessor extends AbstractInputValueAccessor<number, HTMLInputElement>
{


	constructor(el: ElementRef<HTMLInputElement>)
	{
		super(el);
	}


	@HostEvent('input')
	public onInput(): void
	{
		this.onChange.emit(this.getValue());
	}


	@HostEvent('blur')
	public onBlur(): void
	{
		this.onTouched.emit();
	}


	public getValue(): number|null
	{
		const value = this.el.nativeElement.value;
		return value === '' ? null : +value;
	}


	public setValue(value: number|null): void
	{
		this.el.nativeElement.value = value === null ? '' : value + '';
	}


	public focus(): void
	{
		this.el.nativeElement.focus();
	}

}
