import {Directive, Input} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{

	@Input(5)
	input;

}
