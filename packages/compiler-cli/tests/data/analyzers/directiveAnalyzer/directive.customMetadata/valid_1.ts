import {Directive} from '@slicky/core';


@Directive({
	selector: 'test-directive',
	customData: 'hello world',
})
class TestDirective {}
