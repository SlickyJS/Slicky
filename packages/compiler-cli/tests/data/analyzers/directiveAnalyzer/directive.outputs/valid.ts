import {Directive, Output} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestDirective
{

	@Output()
	output;

	@Output('custom-name-output')
	outputWithDifferentName;

}
