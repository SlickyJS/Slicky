import {Directive, Input} from '@slicky/core';
import {isString} from '@slicky/utils';
import {AbstractValidator} from './abstractValidator';


@Directive({
	selector: 'input[pattern]',
})
export class PatternValidator extends AbstractValidator<string>
{


	@Input()
	public pattern: string|RegExp;


	public validate(value: string, done: (errors) => void): void
	{
		if (value === null) {
			done(null);
		} else {
			const regex: RegExp = isString(this.pattern) ? new RegExp(<string>this.pattern) : <RegExp>this.pattern;

			done(regex.test(value) ? null : {pattern: {requiredPattern: regex.toString(), actualValue: value}});
		}
	}

}
