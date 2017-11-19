import {Directive} from '@slicky/core';
import {TestChildDirective} from './directive.innerDirectives.import.childDirective';


@Directive({
	selector: 'test-directive',
	directives: [TestChildDirective],
})
class TestDirective {}
