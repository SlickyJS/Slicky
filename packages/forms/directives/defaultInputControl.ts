import {Directive, ElementRef, DirectivesStorageRef} from '@slicky/core';
import {AbstractInputControl} from './abstractInputControl';


@Directive({
	selector: 'input,textarea,select',
})
export class DefaultInputControl extends AbstractInputControl<any, any>
{


	constructor(el: ElementRef<any>, directives: DirectivesStorageRef)
	{
		super(el, directives);
	}

}
