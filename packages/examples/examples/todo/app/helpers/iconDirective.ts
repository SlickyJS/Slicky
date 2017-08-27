import {Directive, Input, ElementRef, OnInit, OnDestroy, OnUpdate} from '@slicky/core';


@Directive({
	selector: '[icon]',
})
export class IconDirective implements OnInit, OnDestroy, OnUpdate
{


	@Input()
	public icon: string;

	public el: ElementRef;


	constructor(el: ElementRef)
	{
		this.el = el;
	}


	public onInit(): void
	{
		console.log('Icon: initialized in:');
		console.log(this.el.nativeElement);
	}


	public onDestroy(): void
	{
		console.log('Icon: destroyed');
	}


	public onUpdate(input: string, value: any): void
	{
		console.log(`Icon: updated "${input}" with:`);
		console.log(value);

		if (input !== 'icon') {
			return;
		}

		this.el.nativeElement.setAttribute('uk-icon', `icon: ${value}`);
	}

}
