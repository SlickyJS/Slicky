import {Directive} from '@slicky/core';
import {DIRECTIVES} from './directives.innerDirectives.array.index';


@Directive({
	selector: 'test-directive',
	directives: [DIRECTIVES],
})
class TestDirective {}
