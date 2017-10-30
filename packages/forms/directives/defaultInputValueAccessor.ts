import {Directive, ElementRef, HostEvent} from '@slicky/core';
import {AbstractInputValueAccessor} from './abstractInputValueAccessor';


@Directive({
	id: 'sForm:DefaultInputValueAccessor',
	selector: 'input[s:model],textarea[s:model]',
})
export class DefaultInputValueAccessor extends AbstractInputValueAccessor<string, HTMLInputElement|HTMLTextAreaElement>
{


	constructor(el: ElementRef<HTMLInputElement|HTMLTextAreaElement>)
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


	public getValue(): string|null
	{
		const value = this.el.nativeElement.value;
		return value === '' ? null : value;
	}


	public setValue(value: string|null): void
	{
		this.el.nativeElement.value = value === null ? '' : value;
	}


	public focus(): void
	{
		this.el.nativeElement.focus();
	}

}
