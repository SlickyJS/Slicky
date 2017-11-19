import {Directive, Output} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{


	@Output()
	public output;

	@Output('custom-output-name')
	public namedOutput;

}
