import {Container} from '@slicky/di';
import {PlatformBrowser} from '@slicky/platform-browser';
import {ClassType} from '@slicky/lang';
import {isFunction} from '@slicky/utils';
import {Application, Component, ChildDirective, Required} from '@slicky/core';
import {ApplicationOptions} from '@slicky/core/application';
import {DirectiveMetadataLoader} from '@slicky/core/metadata';
import {RootDirectiveRunner} from '@slicky/core/runtime';
import {ComponentTemplate, DirectivesStorageTemplate} from '@slicky/core/templates';
import {JSDOM} from 'jsdom';
import {ApplicationRef} from './applicationRef';
import {DirectiveRef} from './directiveRef';


export class Tester
{


	private static APP_CONTAINER_ID = 'app-container';


	public static run(html: string, options: ApplicationOptions = {}, setup?: (application: Application, container: Container) => void): ApplicationRef
	{
		const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body id="${Tester.APP_CONTAINER_ID}">${html}</body></html>`);
		const doc = dom.window.document;

		options.document = doc;

		const container = new Container;
		const platform = new PlatformBrowser;
		const app = new Application(container, options);

		if (isFunction(setup)) {
			setup(app, container);
		}

		platform.run(app, `#${Tester.APP_CONTAINER_ID}`);

		return new ApplicationRef(app, container, doc);
	}


	public static runRootDirective<T>(el: string, directiveType: ClassType<T>): DirectiveRef<T>
	{
		const app = Tester.run(el);

		if (app.document.body.childNodes.length > 1) {
			throw new Error(`Tester.runRootDirective: el should be only one element definition, "${el}" given.`);
		}

		const metadataLoader = <DirectiveMetadataLoader>app.container.get(DirectiveMetadataLoader);
		const rootRunner = <RootDirectiveRunner>app.container.get(RootDirectiveRunner);

		const elNode = app.document.body.childNodes[0];
		const directive = rootRunner.runDirective(directiveType, metadataLoader.loadDirective(directiveType), <HTMLElement>elNode);

		return new DirectiveRef(app, directive.getDirective(), directive.getTemplate());
	}


	public static runDirective<T>(el: string, directiveType: ClassType<T>): DirectiveRef<T>
	{
		@Component({
			name: 'root-application',
			template: el,
			directives: [directiveType],
		})
		class RootApplicationComponent
		{


			@ChildDirective(directiveType)
			@Required()
			public directive: T;

		}

		const rootDirective = Tester.runRootDirective('<root-application></root-application>', RootApplicationComponent);

		let innerTemplate: ComponentTemplate;

		rootDirective.template.eachChild((template: DirectivesStorageTemplate) => {
			template.eachChild((template: ComponentTemplate) => {
				innerTemplate = template;
			});
		});

		return new DirectiveRef(rootDirective.application, rootDirective.directive.directive, innerTemplate);
	}

}
