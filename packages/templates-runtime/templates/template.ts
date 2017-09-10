import {extend, forEach, isFunction} from '@slicky/utils';
import {BaseTemplate} from './baseTemplate';
import {RenderableTemplate} from './renderableTemplate';
import {ApplicationTemplate} from './applicationTemplate';
import {EmbeddedTemplatesContainer, EmbeddedTemplateFactory} from './embeddedTemplatesContainer';
import {StyleWriter} from '../styles';


export abstract class Template extends RenderableTemplate
{


	private styleWriter: StyleWriter;


	constructor(application: ApplicationTemplate, parent: BaseTemplate)
	{
		super(application, parent);

		this.allowRefreshFromParent = false;
		this.styleWriter = new StyleWriter;
	}


	public static childTemplateExtend(child: any): void
	{
		extend(child, this);
	}


	public abstract main(el: HTMLElement): void;


	public destroy(): void
	{
		super.destroy();

		this.styleWriter.destroy();

		delete this.styleWriter;
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

}
