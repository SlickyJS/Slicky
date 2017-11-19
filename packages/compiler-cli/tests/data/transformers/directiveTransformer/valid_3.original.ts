import {Directive} from '@slicky/core';


@Directive({
	selector: 'test-directive',
})
class TestBaseDirective {}


@Directive({
	selector: 'test-directive',
	override: TestBaseDirective,
})
class TestDirective {}
