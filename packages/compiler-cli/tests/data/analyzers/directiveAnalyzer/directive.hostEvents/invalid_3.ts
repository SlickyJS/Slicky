import {Directive, HostEvent} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{

	@HostEvent('click', 5)
	onClick() {};

}
