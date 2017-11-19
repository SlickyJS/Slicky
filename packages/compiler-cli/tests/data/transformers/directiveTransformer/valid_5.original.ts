import {Directive} from '@slicky/core';


@Directive({
	selector: 'test-directive',
	exportAs: 'dir',
})
class TestDirective {}
