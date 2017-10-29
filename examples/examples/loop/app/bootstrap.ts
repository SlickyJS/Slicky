import 'zone.js';
import 'reflect-metadata';

import {Container} from '@slicky/di';
import {Application} from '@slicky/application';
import {PlatformInline} from '@slicky/platform-inline';
//import {PlatformBrowser} from '@slicky/platform-browser';
import {LoopApp} from './loopApp';


const container = new Container;

const app = new Application(container, {
	directives: [
		LoopApp,
	],
});


const platform = new PlatformInline;
//const platform = new PlatformBrowser;

platform.run(app, '#app');
