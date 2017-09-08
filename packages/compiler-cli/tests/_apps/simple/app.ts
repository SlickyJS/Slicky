import {Container} from '@slicky/di';
import {Application} from '@slicky/application';
import {Component} from '@slicky/core';


@Component({
	selector: '',
	template: '',
})
class TestComponent {}


const container = new Container;
const app = new Application(container, {
	directives: [
		TestComponent,
	],
});


export const APPLICATION = app;
