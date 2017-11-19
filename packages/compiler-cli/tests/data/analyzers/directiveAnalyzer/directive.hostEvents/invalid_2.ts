import {Directive, HostEvent} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{

	@HostEvent(5)
	onClick() {};

}
