import {Directive, Input} from '@slicky/core';
import {AbstractValidator} from './abstractValidator';


@Directive({
	id: 'sForm:MinValidator',
	selector: 'input[min]',
})
export class MinValidator extends AbstractValidator<number>
{


	@Input()
	public min: number;


	public validate(value: number, done: (errors) => void): void
	{
		const min = this.min * 1;

		value = value * 1;

		done(value < min ? {min : {min: min, actual: value}} : null);
	}

}
