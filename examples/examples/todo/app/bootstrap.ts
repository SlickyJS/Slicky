import 'zone.js';
import 'reflect-metadata';

import * as jquery from 'jquery';
import * as UIkit from 'uikit';
import * as UIkitIcons from 'uikit/dist/js/uikit-icons';

import {PlatformInline} from '@slicky/platform-inline';
//import {PlatformBrowser} from '@slicky/platform-browser';

import {todoApp} from './application';


window['$'] = window['jQuery'] = jquery;

UIkit.use(UIkitIcons);


const platform = new PlatformInline;
//const platform = new PlatformBrowser;

platform.run(todoApp, '#app');
