import {Component} from '@slicky/core';


@Component({
	selector: 'test-directive',
	template: '',
	styles: [
		'body {color: red}',
		require('./valid_22.styles.css'),
	],
})
class TestDirective {}
