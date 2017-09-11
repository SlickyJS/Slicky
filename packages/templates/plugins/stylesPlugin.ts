import * as css from '@slicky/css-parser';
import {map, forEach, exists, keys} from '@slicky/utils';
import {ASTHTMLNodeElement, ASTHTMLNodeText, ASTHTMLNodeTextAttribute} from '@slicky/html-parser';
import {Matcher} from '@slicky/query-selector';
import {TemplateEncapsulation} from '@slicky/templates-runtime/templates';
import {EnginePlugin, OnBeforeCompileArgument, OnAfterCompileArgument, OnProcessElementArgument, OnBeforeProcessElementArgument} from '../engine/enginePlugin';
import {createInsertStyleRule, BuilderMethod} from '../builder';


const STYLE_ATTRIBUTE_PREFIX = '__slicky_style';


export class StylesPlugin extends EnginePlugin
{


	private parser: css.CSSParser;

	private name: string;

	private encapsulation: TemplateEncapsulation;

	private processedNonStyleTag: boolean = false;

	private styles: Array<Array<css.CSSNodeSelector>> = [];

	private selectors: {[selector: string]: string} = {};


	constructor()
	{
		super();

		this.parser = new css.CSSParser;
	}


	public onBeforeCompile(arg: OnBeforeCompileArgument): void
	{
		this.name = arg.options.name;
		this.encapsulation = arg.options.encapsulation;

		forEach(arg.options.styles, (styles: string) => {
			this.styles.push(this.parser.parse(styles));
		});
	}


	public onAfterCompile(arg: OnAfterCompileArgument): void
	{
		if (this.styles.length) {
			const main = arg.builder.getMainMethod();

			forEach(this.styles, (styles: Array<css.CSSNodeSelector>) => {
				this.addStyles(main, styles);
			});
		}
	}


	public onBeforeProcessElement(element: ASTHTMLNodeElement, arg: OnBeforeProcessElementArgument): ASTHTMLNodeElement
	{
		if (element.name === 'style') {
			if (this.processedNonStyleTag) {
				throw new Error(`Templates: "style" tag must be the first element in template.`);
			}

			this.styles.unshift(this.parser.parse((<ASTHTMLNodeText>element.childNodes[0]).value));

			arg.stopProcessing();

		} else {
			this.processedNonStyleTag = true;
		}

		return element;
	}


	public onProcessElement(element: ASTHTMLNodeElement, arg: OnProcessElementArgument): void
	{
		if (this.encapsulation !== TemplateEncapsulation.Emulated) {
			return;
		}

		if (element.name === 'style') {
			return;
		}

		let styles = this.findStylesForElement(element, arg.matcher);

		forEach(styles, (style: css.CSSNodeSelector) => {
			if (!exists(this.selectors[style.selector])) {
				this.selectors[style.selector] = `${STYLE_ATTRIBUTE_PREFIX}_${this.name}_${keys(this.selectors).length}`;
			}

			element.attributes.push(new ASTHTMLNodeTextAttribute(this.selectors[style.selector], ''));
		});
	}


	private addStyles(builderMethod: BuilderMethod, stylesheet: Array<css.CSSNodeSelector>): void
	{
		forEach(stylesheet, (selector: css.CSSNodeSelector) => {
			let selectorPath = selector.selector;

			if (this.encapsulation === TemplateEncapsulation.Emulated) {
				if (!exists(this.selectors[selectorPath])) {
					return;
				}

				selectorPath = `[${this.selectors[selectorPath]}]`;
			}

			builderMethod.beginning.add(
				createInsertStyleRule(selectorPath, map(selector.rules, (rule: css.CSSNodeRule) => {
					return rule.render();
				}))
			);
		});
	}


	private findStylesForElement(el: ASTHTMLNodeElement, matcher: Matcher): Array<css.CSSNodeSelector>
	{
		let result: Array<css.CSSNodeSelector> = [];

		forEach(this.styles, (styles: Array<css.CSSNodeSelector>) => {
			forEach(styles, (style: css.CSSNodeSelector) => {
				if (matcher.matches(el, style.selector)) {
					result.push(style);
				}
			});
		});

		return result;
	}

}
