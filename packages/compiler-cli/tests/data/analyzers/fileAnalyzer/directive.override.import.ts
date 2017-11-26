import {Directive} from '@slicky/core';
import {TestBaseDirective} from './directive.override.import.base';


@Directive({
	selector: 'test-directive',
	override: TestBaseDirective,
})
class TestDirective {}
