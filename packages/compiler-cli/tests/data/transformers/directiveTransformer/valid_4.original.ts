import {Directive} from '@slicky/core';
import {TestBaseDirective} from './valid_4.overrideDirective';


@Directive({
	selector: 'test-directive',
	override: TestBaseDirective,
})
class TestDirective {}
