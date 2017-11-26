import {Directive, HostElement, Required} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{


	@HostElement('button')
	public el;

	@HostElement('span')
	@Required()
	public requiredEl;

}
