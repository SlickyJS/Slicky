import {Directive, ChildrenDirective} from '@slicky/core';


@Directive({
	selector: 'test-children-directive',
})
class TestChildrenDirective {}


@Directive({
	selector: 'test-directive',
})
class TestDirective
{

	@ChildrenDirective(TestChildrenDirective)
	children;

}
