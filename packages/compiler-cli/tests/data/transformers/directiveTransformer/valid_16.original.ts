import {Directive} from '@slicky/core';


@Directive({
	selector: 'test-child-directive',
})
class TestChildDirective {}


@Directive({
	selector: 'test-directive',
	directives: [TestChildDirective],
})
class TestDirective {}
