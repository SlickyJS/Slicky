import 'zone.js';
import 'reflect-metadata';

import * as jquery from 'jquery';
import * as UIkit from 'uikit';
import * as UIkitIcons from 'uikit/dist/js/uikit-icons';

import {Container} from '@slicky/di';
import {Application} from '@slicky/application';
import {TranslatorExtension} from '@slicky/extension-translator';
import {PlatformInline} from '@slicky/platform-inline';
//import {PlatformBrowser} from '@slicky/platform-browser';
import {TodoContainerComponent} from './todo';


const container = new Container;

const app = new Application(container, {
	directives: [
		TodoContainerComponent,
	],
});

app.addExtension(new TranslatorExtension('en'));

window['$'] = window['jQuery'] = jquery;

UIkit.use(UIkitIcons);


const platform = new PlatformInline;
//const platform = new PlatformBrowser;

platform.run(app, '#app');
