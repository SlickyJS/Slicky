import {Directive} from '@slicky/core';


@Directive({
	selector: 'test-child-directive',
})
export class TestChildDirective {}

const CHILD_INNER_DIRECTIVES = [TestChildDirective];


export const CHILD_DIRECTIVES = [CHILD_INNER_DIRECTIVES];
