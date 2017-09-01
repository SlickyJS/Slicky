import 'zone.js';
import 'reflect-metadata';

import {PlatformBrowser} from '@slicky/platform-browser';
import {Container} from '@slicky/di';
import {Application} from '@slicky/application';
import {CounterDirective} from './counter';


let platform = new PlatformBrowser;
let container = new Container;

let app = new Application(container, {
	directives: [CounterDirective],
});

platform.run(app, document.getElementById('app'));
