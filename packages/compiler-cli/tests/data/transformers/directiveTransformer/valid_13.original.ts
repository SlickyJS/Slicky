import {Directive, ChildDirective, Required} from '@slicky/core';
import {TestChildDirective} from './valid_13.childDirective';


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
