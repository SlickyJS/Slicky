import {Component} from '@slicky/core';


class TestFilter {}


@Component({
	selector: 'test-component',
	template: '',
	filters: [TestFilter],
})
export class TestComponent {}
