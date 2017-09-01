import 'zone.js';
import 'reflect-metadata';

import * as jquery from 'jquery';
import * as UIkit from 'uikit';
import * as UIkitIcons from 'uikit/dist/js/uikit-icons';

window['$'] = window['jQuery'] = jquery;

UIkit.use(UIkitIcons);

//import {PlatformServer} from '@slicky/platform-server';
import {PlatformBrowser} from '@slicky/platform-browser';

//import {APP_TEMPLATES_FACTORY} from '../aot/app-templates-factory';
import {APPLICATION} from './application';


//let platform = new PlatformServer(APP_TEMPLATES_FACTORY);
let platform = new PlatformBrowser;

platform.run(APPLICATION, document.getElementById('app'));
