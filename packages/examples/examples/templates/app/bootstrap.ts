import 'zone.js';
import 'reflect-metadata';

import {PlatformBrowser} from '@slicky/platform-browser';

import {APPLICATION} from './application';


let platform = new PlatformBrowser;

platform.run(APPLICATION, document.getElementById('app'));
