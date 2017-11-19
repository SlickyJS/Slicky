import {Directive, Input, Required} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{


	@Input()
	public input;

	@Input()
	@Required()
	public requiredInput;

	@Input('data-named-input')
	public namedInput;

	@Input('data-named-required-input')
	@Required()
	public namedRequiredInput;

}
