import {Component} from '@slicky/core';
import {TestFilter} from './component.filters.imported.filter';


@Component({
	selector: 'test-component',
	template: '',
	filters: [TestFilter],
})
class TestComponent {}
