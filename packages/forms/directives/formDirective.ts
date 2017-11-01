import {Directive, HostEvent, Output, ElementRef} from '@slicky/core';
import {EventEmitter} from '@slicky/event-emitter';
import {AbstractFormContainerDirective} from './abstractFormContainerDirective';


@Directive({
	id: 'sForm:FormDirective',
	selector: 'form',
	exportAs: 'sForm',
})
export class FormDirective<T> extends AbstractFormContainerDirective<T>
{


	@Output('s:submit')
	public submitted = new EventEmitter<any>();


	constructor(el: ElementRef<HTMLFormElement>)
	{
		super(el);
	}


	@HostEvent('submit')
	public onSubmit(e/*: Event*/): void
	{
		e.preventDefault();

		if (this.valid) {
			this.submitted.emit(this);
		}
	}

}
