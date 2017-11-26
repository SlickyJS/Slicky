import {Directive} from '@slicky/core';


@Directive({
	selector: 'test-directive',
	directives: 'hello world',
})
class TestDirective {}
