import {Directive, Input} from '@slicky/core';
import {AbstractValidator} from './abstractValidator';


@Directive({
	id: 'sForm:RequiredValidator',
	selector: '[required][s:model]',
})
export class RequiredValidator extends AbstractValidator<string>
{


	@Input()
	public required: boolean|string;


	public validate(value: string, done: (errors) => void): void
	{
		if (this.required === false || this.required === 'false') {
			done(null);
		} else {
			if (value === null) {
				done({required: true});
			} else {
				done(null);
			}
		}
	}

}
