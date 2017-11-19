import {Directive} from '@slicky/core';
import {CHILD_DIRECTIVES} from './valid_19.innerDirective';


@Directive({
	selector: 'test-directive',
	directives: [CHILD_DIRECTIVES],
})
class TestDirective {}
