import {Container} from '@slicky/di';
import {Application} from '@slicky/application';
import {ApplicationOptions} from '@slicky/application/application';
import {PlatformBrowser} from '@slicky/platform-browser';
import {JSDOM} from 'jsdom';
import {ApplicationRef} from './applicationRef';


export class Tester
{


	private static APP_CONTAINER_ID = 'app-container';


	public static run(html: string, options: ApplicationOptions = {}): ApplicationRef
	{
		const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body id="${Tester.APP_CONTAINER_ID}">${html}</body></html>`);
		const doc = dom.window.document;

		options.document = doc;

		const container = new Container;
		const platform = new PlatformBrowser;
		const app = new Application(container, options);

		platform.run(app, `#${Tester.APP_CONTAINER_ID}`);

		return new ApplicationRef(doc);
	}

}
