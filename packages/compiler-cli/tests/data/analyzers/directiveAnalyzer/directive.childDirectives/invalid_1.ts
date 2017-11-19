import {Directive, ChildDirective} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{

	@ChildDirective()
	child;

}
