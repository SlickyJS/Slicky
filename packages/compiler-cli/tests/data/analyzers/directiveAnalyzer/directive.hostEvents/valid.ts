import {Directive, HostEvent, HostElement} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{

	@HostElement('button')
	el;

	@HostEvent('click')
	onEvent() {}

	@HostEvent('click', 'div')
	onEventWithSelector() {}

	@HostEvent('click', '@el')
	onEventWithHostElement() {}

}
