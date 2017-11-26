import {Directive} from '@slicky/core';
import {TestChildDirective} from './valid_18.innerDirective';


@Directive({
	selector: 'test-directive',
	directives: [TestChildDirective],
})
class TestDirective {}
