import {Directive} from '@slicky/core';


@Directive({
	selector: 'test-child-directive',
})
class TestChildDirective {}


const INNER_DIRECTIVES = [TestChildDirective];
const INNER_INNER_DIRECTIVES = [INNER_DIRECTIVES];


@Directive({
	selector: 'test-directive',
	directives: [INNER_INNER_DIRECTIVES],
})
class TestDirective {}
