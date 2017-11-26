import {Directive} from '@slicky/core';


@Directive({
	selector: 'test-directive',
	exportAs: ['dirA', 'dirB'],
})
class TestDirective {}
