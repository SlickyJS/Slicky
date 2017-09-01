import {Container} from '@slicky/di';
import {Application} from '@slicky/application';
import {TranslatorExtension} from '@slicky/extension-translator';

import {TodoContainerComponent} from './todo';


let container = new Container;

let app = new Application(container, {
	directives: [
		TodoContainerComponent
	],
});

app.addExtension(new TranslatorExtension('en'));


export const APPLICATION = app;
