import {Directive, Input} from '@slicky/core';
import {AbstractValidator} from './abstractValidator';


@Directive({
	selector: 'input[maxlength]',
})
export class MaxLengthValidator extends AbstractValidator<string>
{


	@Input('maxlength')
	public maxLength: number;


	public validate(value: string, done: (errors) => void): void
	{
		const maxLength = this.maxLength * 1;
		const length = value ? value.length : 0;

		done(length > maxLength ? {maxLength : {requiredLength: maxLength, actualLength: length}} : null);
	}

}
