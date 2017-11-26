import {Directive, Input, Required} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{

	@Input()
	input;

	@Input('custom-name-input')
	inputWithDifferentName;

	@Input()
	@Required()
	inputRequired;

	@Input('custom-name-required-input')
	@Required()
	inputRequiredWithDifferentName;

}
