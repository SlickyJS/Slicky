import {Directive, ElementRef, HostEvent} from '@slicky/core';
import {AbstractInputValueAccessor} from './abstractInputValueAccessor';


@Directive({
	id: 'sForm:SelectInputValueAccessor',
	selector: 'select',
})
export class SelectInputValueAccessor extends AbstractInputValueAccessor<string, HTMLSelectElement>
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


	public getValue(): string
	{
		return this.el.nativeElement.options[this.el.nativeElement.selectedIndex].value;
	}


	public setValue(value: string): void
	{
		const options = this.el.nativeElement.options;

		for (let i = 0; i < options.length; i++) {
			if (options[i].value === value) {
				this.el.nativeElement.selectedIndex = i;
				break;
			}
		}
	}


	public focus(): void
	{
		this.el.nativeElement.focus();
	}

}
