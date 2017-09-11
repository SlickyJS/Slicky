import * as css from '@slicky/css-parser';
import {map, forEach, exists, keys} from '@slicky/utils';
import {ASTHTMLNodeElement, ASTHTMLNodeText, ASTHTMLNodeTextAttribute} from '@slicky/html-parser';
import {Matcher} from '@slicky/query-selector';
import {TemplateEncapsulation} from '@slicky/templates-runtime/templates';
import {EnginePlugin, OnBeforeCompileArgument, OnAfterCompileArgument, OnProcessElementArgument, OnBeforeProcessElementArgument} from '../engine/enginePlugin';
import {createInsertStyleRule, BuilderMethod} from '../builder';


const STYLE_ATTRIBUTE_PREFIX = '__slicky_style';


declare interface CSSRuleBuffer
{
	rule: css.CSSNodeRule;
	selector: css.CSSNodeSelector;
}


export class StylesPlugin extends EnginePlugin
{


	private parser: css.CSSParser;

	private name: string;

	private encapsulation: TemplateEncapsulation;

	private processedNonStyleTag: boolean = false;

	private styles: Array<Array<css.CSSNodeRule>> = [];

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

			forEach(this.styles, (styles: Array<css.CSSNodeRule>) => {
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

		forEach(styles, (buffer: CSSRuleBuffer) => {
			if (!exists(this.selectors[buffer.selector.value])) {
				this.selectors[buffer.selector.value] = `${STYLE_ATTRIBUTE_PREFIX}_${this.name}_${keys(this.selectors).length}`;
			}

			if (this.encapsulation === TemplateEncapsulation.Emulated) {
				forEach(buffer.rule.selectors, (selector: css.CSSNodeSelector) => {
					if (!exists(this.selectors[selector.value])) {
						this.selectors[selector.value] = this.selectors[buffer.selector.value];
					}
				});
			}

			element.attributes.push(new ASTHTMLNodeTextAttribute(this.selectors[buffer.selector.value], ''));
		});
	}


	private addStyles(builderMethod: BuilderMethod, styles: Array<css.CSSNodeRule>): void
	{
		forEach(styles, (rule: css.CSSNodeRule) => {
			let selectors: Array<string> = [];

			forEach(rule.selectors, (selector: css.CSSNodeSelector) => {
				if (this.encapsulation === TemplateEncapsulation.Emulated) {
					if (!exists(this.selectors[selector.value])) {
						return;
					}

					if (selectors.indexOf(`[${this.selectors[selector.value]}]`) < 0) {
						selectors.push(`[${this.selectors[selector.value]}]`);
					}

				} else {
					selectors.push(selector.value);
				}
			});

			if (!selectors.length) {
				return;
			}

			builderMethod.beginning.add(
				createInsertStyleRule(selectors, map(rule.declarations, (declaration: css.CSSNodeDeclaration) => {
					return declaration.render();
				}))
			);
		});
	}


	private findStylesForElement(el: ASTHTMLNodeElement, matcher: Matcher): Array<CSSRuleBuffer>
	{
		let result: Array<CSSRuleBuffer> = [];

		forEach(this.styles, (rules: Array<css.CSSNodeRule>) => {
			forEach(rules, (rule: css.CSSNodeRule) => {
				let currentRule: CSSRuleBuffer = {
					rule: rule,
					selector: null,
				};

				forEach(rule.selectors, (selector: css.CSSNodeSelector) => {
					if (matcher.matches(el, selector.value)) {
						currentRule.selector = selector;
					}
				});

				if (currentRule.selector !== null) {
					result.push(currentRule);
				}
			});
		});

		return result;
	}

}
