import {Directive} from '@slicky/core';
import {AbstractValidator} from './abstractValidator';


// https://github.com/angular/angular/blob/4.4.6/packages/forms/src/validators.ts#L44-L45
const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;


@Directive({
	selector: 'input[type="email"]',
})
export class EmailValidator extends AbstractValidator<string>
{


	public validate(value: string, done: (errors) => void): void
	{
		if (value == null || value === '') {
			done(null);
		} else {
			done(EMAIL_REGEXP.test(value) ? null : {email: true});
		}
	}

}
