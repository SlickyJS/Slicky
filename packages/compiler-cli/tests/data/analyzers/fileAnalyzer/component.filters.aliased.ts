import {Component} from '@slicky/core';
import {TestFilter as MyFilter} from './component.filters.aliased.filter';


@Component({
	selector: 'test-component',
	template: '',
	filters: [MyFilter],
})
class TestComponent {}
