import 'zone.js';
import 'reflect-metadata';

import * as jquery from 'jquery';
import * as UIkit from 'uikit';
import * as UIkitIcons from 'uikit/dist/js/uikit-icons';

window['$'] = window['jQuery'] = jquery;

UIkit.use(UIkitIcons);

//import {PlatformServer} from '@slicky/platform-server';
import {PlatformBrowser} from '@slicky/platform-browser';
import {Container} from '@slicky/di';
import {Application} from '@slicky/application';
import {ApplicationTemplate} from '@slicky/templates-runtime';
import {TranslatorExtension} from '@slicky/extension-translator';

import {APP_DIRECTIVES} from './directives';
//import {APP_TEMPLATES_FACTORY} from '../aot/app-templates-factory';


//let platform = new PlatformServer(APP_TEMPLATES_FACTORY);
let platform = new PlatformBrowser;
let container = new Container;
let template = new ApplicationTemplate;

let app = new Application(platform, template, container, {
	appElement: document.getElementById('app'),
	directives: APP_DIRECTIVES,
});

app.addExtension(new TranslatorExtension('en'));

app.run();
