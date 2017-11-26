import {Directive, ChildrenDirective} from '@slicky/core';


@Directive({
	selector: 'test-child-directive',
})
class TestChildDirective {}


@Directive({
	selector: 'test-directive',
})
class TestDirective
{


	@ChildrenDirective(TestChildDirective)
	public children;

}
