import {Component, ChildDirective} from '@slicky/core';
import {TestChildDirective} from './valid_4.childDirective';


@Component({
	selector: 'test-component',
	template: '<div></div>',
	directives: [TestChildDirective],
})
class TestComponent
{


	@ChildDirective(TestChildDirective)
	public child: TestChildDirective;

}
