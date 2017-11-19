import {Component} from '@slicky/core';
import {TestFilter} from './valid_21.filter';


@Component({
	selector: 'test-component',
	template: '',
	filters: [TestFilter],
})
class TestComponent {}
