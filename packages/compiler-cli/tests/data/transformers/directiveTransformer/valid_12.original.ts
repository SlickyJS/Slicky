import {Directive, ChildDirective, Required} from '@slicky/core';


@Directive({
	selector: 'test-child-directive',
})
class TestChildDirective {}


@Directive({
	selector: 'test-directive',
})
class TestDirective
{


	@ChildDirective(TestChildDirective)
	public child;

	@ChildDirective(TestChildDirective)
	@Required()
	public requiredChild;

}
