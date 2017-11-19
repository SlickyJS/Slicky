import {Directive, ChildrenDirective} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{

	@ChildrenDirective()
	child;

}
