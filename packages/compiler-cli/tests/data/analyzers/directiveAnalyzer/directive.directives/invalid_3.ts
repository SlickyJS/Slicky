import {Directive} from '@slicky/core';
import {CHILD_DIRECTIVES} from './invalid_3.innerDirective';


@Directive({
	selector: 'test-directive',
	directives: [CHILD_DIRECTIVES],
})
class TestDirective {}
