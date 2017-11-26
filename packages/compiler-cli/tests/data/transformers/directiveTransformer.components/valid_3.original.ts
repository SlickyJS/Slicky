import {Directive, Component, ChildDirective} from '@slicky/core';


@Directive({
	selector: 'div',
})
class TestChildDirective {}


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
