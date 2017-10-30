import {Directive, ElementRef, HostEvent} from '@slicky/core';
import {AbstractInputValueAccessor} from './abstractInputValueAccessor';
import {DefaultInputValueAccessor} from './defaultInputValueAccessor';


@Directive({
	id: 'sForm:CheckboxInputValueAccessor',
	selector: 'input[type="checkbox"][s:model]',
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


	@HostEvent('blur')
	public onBlur(): void
	{
		this.onTouched.emit();
	}


	public getValue(): boolean
	{
		return this.el.nativeElement.checked;
	}


	public setValue(value: boolean): void
	{
		this.el.nativeElement.checked = value;
	}


	public focus(): void
	{
		this.el.nativeElement.focus();
	}

}
