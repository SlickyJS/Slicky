import {Directive, Input, ElementRef, OnUpdate} from '@slicky/core';


@Directive({
	selector: '[icon]',
})
export class IconDirective implements OnUpdate
{


	@Input()
	public icon: string;

	public el: ElementRef<HTMLElement>;


	constructor(el: ElementRef<HTMLElement>)
	{
		this.el = el;
	}


	public onUpdate(input: string, value: any): void
	{
		if (input !== 'icon') {
			return;
		}

		this.el.nativeElement.setAttribute('uk-icon', `icon: ${value}`);
	}

}
