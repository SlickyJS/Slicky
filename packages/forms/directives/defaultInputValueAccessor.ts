import {Directive, ElementRef, HostEvent} from '@slicky/core';
import {AbstractInputValueAccessor} from './abstractInputValueAccessor';


@Directive({
	selector: 'input,textarea',
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


	public getValue(): string|null
	{
		const value = this.el.nativeElement.value;
		return value === '' ? null : value;
	}


	public setValue(value: string|null): void
	{
		this.el.nativeElement.value = value === null ? '' : value;
	}

}
