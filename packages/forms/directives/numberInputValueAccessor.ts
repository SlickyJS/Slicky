import {Directive, ElementRef, HostEvent} from '@slicky/core';
import {AbstractInputValueAccessor} from './abstractInputValueAccessor';
import {DefaultInputValueAccessor} from './defaultInputValueAccessor';


@Directive({
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


	public getValue(): number|null
	{
		const value = this.el.nativeElement.value;
		return value === '' ? null : +value;
	}


	public setValue(value: number|null): void
	{
		this.el.nativeElement.value = value === null ? '' : value + '';
	}

}
