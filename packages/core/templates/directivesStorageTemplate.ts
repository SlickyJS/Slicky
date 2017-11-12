import {
	RenderableTemplate, ApplicationTemplate, BaseTemplate, TemplateParametersList, TemplateElement,
	RenderableEmbeddedTemplateFactory, EmbeddedTemplatesContainer
} from '@slicky/templates/templates';
import {Renderer} from '@slicky/templates/dom';
import {DirectiveMetadataLoader} from '@slicky/core/metadata';
import {Container, ProviderOptions} from '@slicky/di';
import {isFunction} from '@slicky/utils';
import {ClassType} from '@slicky/lang';
import {ChangeDetector, ChangeDetectorRef, RealmRef} from '@slicky/core/directives';
import {DirectiveDefinition} from '@slicky/core/metadata';
import {ComponentTemplate} from './componentTemplate';
import {DirectiveFactory, DirectiveTypesProvider} from '../runtime';


export class DirectivesStorageTemplate extends RenderableTemplate
{


	public root: ComponentTemplate;

	private container: Container;

	private directiveFactory: DirectiveFactory;

	private metadataLoader: DirectiveMetadataLoader;

	private parentDirectivesProvider: DirectiveTypesProvider;

	private el: TemplateElement;


	constructor(document: Document, renderer: Renderer, application: ApplicationTemplate, root: ComponentTemplate, parent: BaseTemplate, container: Container, directiveFactory: DirectiveFactory, metadataLoader: DirectiveMetadataLoader, parentDirectivesProvider: DirectiveTypesProvider, el: TemplateElement, parameters: TemplateParametersList = {})
	{
		super(document, renderer, application, root, parent, parameters);

		this.container = container;
		this.directiveFactory = directiveFactory;
		this.metadataLoader = metadataLoader;
		this.parentDirectivesProvider = parentDirectivesProvider;
		this.el = el;

		this.initialized = true;
	}


	public hasOwnParameter(name: string): boolean
	{
		return this.parent.hasOwnParameter(name);
	}


	public getParameter(name: string): any
	{
		return this.parent.getParameter(name);
	}


	public setParameter(name: string, value: any): void
	{
		this.parent.setParameter(name, value);
	}


	public removeParameter(name: string): void
	{
		this.parent.removeParameter(name);
	}


	public addDirective(localParameterName: string, directiveType: ClassType<any>, setup?: (directive: any) => void): void
	{
		const metadata = this.metadataLoader.loadDirective(directiveType);

		this.parentDirectivesProvider.registerInnerDirectives(metadata.directives);

		this._createDirective(localParameterName, this.container, directiveType, metadata, [], setup);
	}


	public addComponent(localParameterName: string, componentType: ClassType<any>, setup?: (component: any, template: ComponentTemplate, outerTemplate: BaseTemplate) => void): void
	{
		const changeDetector = new ChangeDetector;
		const realm = new RealmRef;

		const metadata = this.metadataLoader.loadDirective(componentType);
		const container = this.container.fork();

		container.addService(ChangeDetectorRef, {
			useFactory: () => new ChangeDetectorRef(changeDetector),
		});

		container.addService(RealmRef, {
			useValue: realm,
		});

		const component = this._createDirective(localParameterName, container, componentType, metadata);

		this.directiveFactory.runComponent(container, component, metadata, this, this.el._nativeNode, changeDetector, realm, setup);
	}


	protected createEmbeddedTemplatesContainer(factory: RenderableEmbeddedTemplateFactory, marker: Comment): EmbeddedTemplatesContainer
	{
		return new EmbeddedTemplatesContainer(this.application, this.root, this, this.document, this.renderer, factory, marker);
	}


	private _createDirective<T>(localParameterName: string, container: Container, directiveType: ClassType<T>, metadata: DirectiveDefinition, providers: Array<ProviderOptions> = [], setup?: (directive: T) => void): T
	{
		const directive = <T>this.directiveFactory.createDirective(container, directiveType, metadata, this.el._nativeNode, providers);

		if (isFunction(setup)) {
			setup(directive);
		}

		this.setParameter(localParameterName, directive);

		this.onDestroy(() => {
			if (isFunction(directive['onDestroy'])) {
				this.run(() => directive['onDestroy']());
			}

			this.removeParameter(localParameterName);
		});

		return directive;
	}

}
