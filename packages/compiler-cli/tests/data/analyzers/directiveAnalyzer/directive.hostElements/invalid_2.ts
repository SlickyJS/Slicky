import {Directive, HostElement} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{

	@HostElement(5)
	el;

}
