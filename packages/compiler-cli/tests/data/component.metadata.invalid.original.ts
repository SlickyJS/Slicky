import {Component} from '@slicky/core';


class TestFilter {}


@Component({
	name: 'test-component',
	template: '',
	filters: [TestFilter],
})
export class TestComponent {}
