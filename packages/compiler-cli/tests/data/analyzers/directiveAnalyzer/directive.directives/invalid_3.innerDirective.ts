import {Directive} from '@slicky/core';


@Directive({
	selector: 'test-child-directive',
})
class TestChildDirective {}


export const CHILD_DIRECTIVES = [TestChildDirective];
