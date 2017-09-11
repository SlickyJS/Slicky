import {extend, isFunction} from '@slicky/utils';
import {BaseTemplate} from './baseTemplate';
import {RenderableTemplate} from './renderableTemplate';
import {ApplicationTemplate} from './applicationTemplate';
import {EmbeddedTemplatesContainer, EmbeddedTemplateFactory} from './embeddedTemplatesContainer';
import {StyleWriter} from '../styles';


const ShadowDOMSafeElements: Array<string> = [
	'article', 'aside', 'blockquote', 'body', 'div', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'nav', 'p',
	'section', 'span'
];


export abstract class Template extends RenderableTemplate
{


	private styleWriter: StyleWriter;


	constructor(application: ApplicationTemplate, parent: BaseTemplate)
	{
		super(application, parent);

		this.styleWriter = new StyleWriter(document.head);
		this.allowRefreshFromParent = false;
	}


	public static childTemplateExtend(child: any): void
	{
		extend(child, this);
	}


	public abstract main(el: HTMLElement): void;


	public destroy(): void
	{
		super.destroy();

		if (this.styleWriter) {
			this.styleWriter.destroy();
			delete this.styleWriter;
		}
	}


	public render(el: HTMLElement): void
	{
		el.innerHTML = '';

		this.main(el);
	}


	public _createEmbeddedTemplatesContainer(parent: RenderableTemplate, el: Node, factory: EmbeddedTemplateFactory, setup: (template: EmbeddedTemplatesContainer) => void = null): EmbeddedTemplatesContainer
	{
		let container = new EmbeddedTemplatesContainer(this.application, el, factory, parent, this);

		if (isFunction(setup)) {
			setup(container);
		}

		return container;
	}


	protected insertStyleRule(selector: string, rules: Array<string>): void
	{
		this.styleWriter.insertRule(selector, rules);
	}


	protected createShadowDOM(el: HTMLElement): any
	{
		assertElementNameAllowedForNativeEncapsulation(el.nodeName);

		const dom = el.attachShadow({mode: "open"});

		this.styleWriter.changeParent(dom);

		return dom;
	}

}


function assertElementNameAllowedForNativeEncapsulation(name: string): void
{
	name = name.toLowerCase();

	if (ShadowDOMSafeElements.indexOf(name) === -1 && name.indexOf('-') === -1) {
		throw new Error(`TemplateEncapsulation.Native is not supported for element <${name}>. Only ${ShadowDOMSafeElements.join(', ')} and custom elements with dash in the name are allowed.`);
	}
}
