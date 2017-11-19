import {Directive, HostElement} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{

	@HostElement()
	el;

}
