import {Directive, Output} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{

	@Output(5)
	output;

}
