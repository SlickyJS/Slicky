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


	public getValue(): number
	{
		return +this.el.nativeElement.value;
	}


	public setValue(value: number): void
	{
		this.el.nativeElement.value = value + '';
	}

}
