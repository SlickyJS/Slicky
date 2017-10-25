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


	public getValue(): string
	{
		return this.el.nativeElement.value;
	}


	public setValue(value: string): void
	{
		this.el.nativeElement.value = value;
	}

}
