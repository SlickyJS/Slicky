import {Directive, HostElement, Required} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{

	@HostElement('button')
	el;

	@HostElement('div')
	@Required()
	elRequired;

}
