import 'zone.js';
import 'reflect-metadata';

import {PlatformBrowser} from '@slicky/platform-browser';
import {Container} from '@slicky/di';
import {Application} from '@slicky/application';
import {ApplicationTemplate} from '@slicky/templates-runtime';
import {AppComponent} from './app';


let platform = new PlatformBrowser;
let container = new Container;
let template = new ApplicationTemplate;

let app = new Application(platform, template, container, {
	appElement: document.getElementById('app'),
	directives: [AppComponent],
});

app.run();
