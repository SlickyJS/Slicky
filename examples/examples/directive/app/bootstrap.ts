import 'zone.js';
import 'reflect-metadata';

import {PlatformBrowser} from '@slicky/platform-browser';
import {Container} from '@slicky/di';
import {Application} from '@slicky/core';
import {CounterDirective} from './counter';


const platform = new PlatformBrowser;
const container = new Container;

const app = new Application(container, {
	directives: [CounterDirective],
});

platform.run(app, '#app');
