import {Container} from '@slicky/di';
import {Application} from '@slicky/application';
import {TemplatesComponent} from './templatesComponent';


let container = new Container;

let app = new Application(container, {
	directives: [
		TemplatesComponent,
	],
});


export const APPLICATION = app;
