import {Component} from '@slicky/core';


@Component({
	selector: 'test-component',
	template: '',
	styles: [
		'body {color: red}',
		require('/styles.css'),
	],
})
class TestComponent {}
