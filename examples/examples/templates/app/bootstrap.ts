import 'zone.js';
import 'reflect-metadata';

import {Container} from '@slicky/di';
import {Application} from '@slicky/application';
import {PlatformServer} from '@slicky/platform-server';
//import {PlatformBrowser} from '@slicky/platform-browser';
import {TemplatesComponent} from './templatesComponent';

import {APP_TEMPLATES_FACTORY} from '../aot/app-templates-factory';


const container = new Container;

const app = new Application(container, {
	directives: [
		TemplatesComponent,
	],
});


const platform = new PlatformServer(APP_TEMPLATES_FACTORY);
//const platform = new PlatformBrowser;

platform.run(app, '#app');
