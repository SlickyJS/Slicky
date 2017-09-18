import {exists} from '@slicky/utils';
import {BaseTemplate, TemplateParametersList} from './baseTemplate';
import {RenderableTemplate, RenderableEmbeddedTemplateFactory} from './renderableTemplate';
import {EmbeddedTemplatesContainer} from './embeddedTemplatesContainer';
import {ApplicationTemplate} from './applicationTemplate';
import {Renderer} from '../dom';
import {StyleWriter} from '../styles';
import * as nodes from './nodes';


export declare interface TemplateRenderOptions
{
	useShadowDOM?: boolean;
}


export declare type TemplateRenderFactory = (template: Template, el: nodes.TemplateElement) => void;


export class Template extends RenderableTemplate
{


	private styleWriter: StyleWriter;


	constructor(document: Document, renderer: Renderer, application: ApplicationTemplate, parent: BaseTemplate, parameters: TemplateParametersList = {})
	{
		super(document, renderer, application, undefined, parent, parameters);

		this.root = this;

		this.useParentParameters = false;
		this.useParentTemplates = false;
		this.useRefreshFromParent = false;
		this.useFiltersFromParent = false;

		this.styleWriter = new StyleWriter(this.document, this.document.head);
	}


	public render(el: Element, factoryOrOptions: TemplateRenderFactory|TemplateRenderOptions, factory?: TemplateRenderFactory, ...args: Array<any>): void
	{
		let options: TemplateRenderOptions;

		if (exists(factory)) {
			options = <TemplateRenderOptions>factoryOrOptions;
		} else {
			options = {};
			factory = <TemplateRenderFactory>factoryOrOptions;
		}

		if (!exists(options.useShadowDOM)) {
			options.useShadowDOM = false;
		}

		el.innerHTML = '';

		if (options.useShadowDOM) {
			assertElementNameAllowedForNativeEncapsulation(el.nodeName);
			el = <any>el.attachShadow({mode: 'open'});
			this.styleWriter.changeParent(el);
		}

		const root = new nodes.TemplateElement(this.document, '#template-root', {}, el);

		this._doRender(root, factory, ...args);
	}


	public destroy(): void
	{
		super.destroy();

		this.styleWriter.destroy();
	}


	public insertStyleRule(rule: string): void
	{
		this.styleWriter.insertRule(rule);
	}


	protected createEmbeddedTemplatesContainer(factory: RenderableEmbeddedTemplateFactory, marker: Comment): EmbeddedTemplatesContainer
	{
		return new EmbeddedTemplatesContainer(this.application, this, this, this.document, this.renderer, factory, marker);
	}

}


const ShadowDOMSafeElements: Array<string> = [
	'article', 'aside', 'blockquote', 'body', 'div', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'nav', 'p',
	'section', 'span'
];


function assertElementNameAllowedForNativeEncapsulation(name: string): void
{
	name = name.toLowerCase();

	if (ShadowDOMSafeElements.indexOf(name) === -1 && name.indexOf('-') === -1) {
		throw new Error(`Shadow DOM is not supported for element <${name}>. Only ${ShadowDOMSafeElements.join(', ')} and custom elements with dash in the name are allowed.`);
	}
}
