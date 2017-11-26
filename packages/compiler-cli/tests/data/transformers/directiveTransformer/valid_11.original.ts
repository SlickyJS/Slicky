import {Directive, HostElement, HostEvent} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{


	@HostElement('button')
	public el;

	@HostEvent('click')
	public onClick(): void {}

	@HostEvent('click', 'button')
	public onClickInner(): void {}

	@HostEvent('click', '@el')
	public onClickHostElement(): void {}

}
