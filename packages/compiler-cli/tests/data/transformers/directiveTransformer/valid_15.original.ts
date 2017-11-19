import {Directive, ChildrenDirective} from '@slicky/core';
import {TestChildDirective} from './valid_15.childrenDirective';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{


	@ChildrenDirective(TestChildDirective)
	public children;

}
