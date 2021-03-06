import {Directive, Input} from '@slicky/core';
import {AbstractValidator} from './abstractValidator';


@Directive({
	id: 'sForm:MinLengthValidator',
	selector: '[minlength][s:model]',
})
export class MinLengthValidator extends AbstractValidator<string>
{


	@Input('minlength')
	public minLength: number;


	public validate(value: string, done: (errors) => void): void
	{
		const minLength = this.minLength * 1;
		const length = value ? value.length : 0;

		done(length < minLength ? {minLength : {requiredLength: minLength, actualLength: length}} : null);
	}

}
