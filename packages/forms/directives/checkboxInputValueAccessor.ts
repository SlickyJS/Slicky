import {Directive, ElementRef, HostEvent} from '@slicky/core';
import {AbstractInputValueAccessor} from './abstractInputValueAccessor';
import {DefaultInputValueAccessor} from './defaultInputValueAccessor';


@Directive({
	selector: 'input[type="checkbox"]',
	override: DefaultInputValueAccessor,
})
export class CheckboxInputValueAccessor extends AbstractInputValueAccessor<boolean, HTMLInputElement>
{


	constructor(el: ElementRef<HTMLInputElement>)
	{
		super(el);
	}


	@HostEvent('change')
	public onInput(): void
	{
		this.onChange.emit(this.getValue());
	}


	public getValue(): boolean
	{
		return this.el.nativeElement.checked;
	}


	public setValue(value: boolean): void
	{
		this.el.nativeElement.checked = value;
	}

}
