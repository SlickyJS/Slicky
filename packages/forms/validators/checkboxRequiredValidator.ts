import {Directive, Input} from '@slicky/core';
import {AbstractValidator} from './abstractValidator';
import {RequiredValidator} from './requiredValidator';


@Directive({
	id: 'sForm:CheckboxRequiredValidator',
	selector: 'input[type="checkbox"][required][s:model]',
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
