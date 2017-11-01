import {Directive, ElementRef} from '@slicky/core';
import {AbstractFormContainerDirective} from './abstractFormContainerDirective';


@Directive({
	id: 'sForm:FormContainerDirective',
	selector: 'form-container',
	exportAs: 'sFormContainer',
})
export class FormContainerDirective extends AbstractFormContainerDirective<any>
{


	constructor(el: ElementRef<any>)
	{
		super(el);
	}

}
