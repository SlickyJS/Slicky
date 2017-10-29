import {Directive, Input} from '@slicky/core';
import {AbstractValidator} from './abstractValidator';


@Directive({
	id: 'sForm:MaxValidator',
	selector: 'input[max]',
})
export class MaxValidator extends AbstractValidator<number>
{


	@Input()
	public max: number;


	public validate(value: number, done: (errors) => void): void
	{
		const max = this.max * 1;

		value = value * 1;

		done(value > max ? {max : {max: max, actual: value}} : null);
	}

}
