import {Directive, HostEvent} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{

	@HostEvent()
	onClick() {};

}
