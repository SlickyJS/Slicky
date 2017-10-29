import {Directive, ElementRef, DirectivesStorageRef} from '@slicky/core';
import {Renderer} from '@slicky/templates/dom';
import {AbstractInputControl} from './abstractInputControl';


@Directive({
	id: 'sForm:DefaultInputControl',
	selector: 'input,textarea,select',
})
export class DefaultInputControl extends AbstractInputControl<any, any>
{


	constructor(renderer: Renderer, el: ElementRef<any>, directives: DirectivesStorageRef)
	{
		super(renderer, el, directives);
	}

}
