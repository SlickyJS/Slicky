import 'zone.js';
import 'reflect-metadata';

import {Container} from '@slicky/di';
import {Application} from '@slicky/application';
import {PlatformInline} from '@slicky/platform-inline';
//import {PlatformBrowser} from '@slicky/platform-browser';
import {TemplatesComponent} from './templatesComponent';


const container = new Container;

const app = new Application(container, {
	directives: [
		TemplatesComponent,
	],
});


const platform = new PlatformInline;
//const platform = new PlatformBrowser;

platform.run(app, '#app');
