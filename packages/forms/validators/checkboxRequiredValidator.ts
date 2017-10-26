import {Directive, Input} from '@slicky/core';
import {AbstractValidator} from './abstractValidator';
import {RequiredValidator} from './requiredValidator';


@Directive({
	selector: 'input[type="checkbox"][required]',
	override: RequiredValidator,
})
export class CheckboxRequiredValidator extends AbstractValidator<boolean>
{


	@Input()
	public required: boolean|string;


	public validate(value: boolean, done: (errors) => void): void
	{
		if (this.required === false || this.required === 'false') {
			done(null);
		} else {
			done(value === true ? null : {required: true});
		}
	}

}
