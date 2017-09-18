import * as css from '@slicky/css-parser';
import {map, forEach, exists, keys} from '@slicky/utils';
import {ASTHTMLNodeElement, ASTHTMLNodeText, ASTHTMLNodeTextAttribute} from '@slicky/html-parser';
import {Matcher} from '@slicky/query-selector';
import {TemplateEncapsulation} from '@slicky/templates/templates';
import {BuilderFunction} from '../builder';
import {
	EnginePlugin, OnBeforeCompileArgument, OnAfterCompileArgument, OnProcessElementArgument,
	OnBeforeProcessElementArgument,
} from '../engine/enginePlugin';


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

	private styles: Array<css.CSSNodeStylesheet> = [];

	private selectors: {[simpleSelector: string]: string} = {};


	constructor()
	{
		super();

		this.parser = new css.CSSParser;
	}


	public onBeforeCompile(arg: OnBeforeCompileArgument): void
	{
		this.name = arg.options.name || '';
		this.encapsulation = arg.options.encapsulation;

		forEach(arg.options.styles, (styles: string) => {
			this.styles.push(this.parser.parse(styles));
		});
	}


	public onAfterCompile(arg: OnAfterCompileArgument): void
	{
		if (this.styles.length) {
			forEach(this.styles, (styles: css.CSSNodeStylesheet) => {
				this.addStyles(arg.render, styles);
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
			element.attributes.push(new ASTHTMLNodeTextAttribute(this.getSelectorReplacement(buffer), ''));
		});
	}


	private addStyles(render: BuilderFunction, styles: css.CSSNodeStylesheet): void
	{
		const getParsedRules = (rules: Array<css.CSSNodeRule>): Array<string> => {
			let result: Array<string> = [];

			forEach(rules, (rule: css.CSSNodeRule) => {
				let selectors: Array<string> = [];

				forEach(rule.selectors, (selector: css.CSSNodeSelector) => {
					if (this.encapsulation === TemplateEncapsulation.Emulated) {
						const selectorParts = this.splitSelector(selector.value);

						if (!exists(this.selectors[selectorParts.selector])) {
							return;
						}

						const realSelector = `[${this.selectors[selectorParts.selector]}]` + (selectorParts.pseudoElement ? `::${selectorParts.pseudoElement}` : '');

						if (selectors.indexOf(realSelector) < 0) {
							selectors.push(realSelector);
						}

					} else {
						selectors.push(selector.value);
					}
				});

				if (!selectors.length) {
					return;
				}

				const declarations = map(rule.declarations, (declaration: css.CSSNodeDeclaration) => {
					return declaration.render().replace(/(")/g, '\\"');
				});

				result.push(`${selectors.join(', ')} {${declarations.join('; ')}}`);
			});

			return result;
		};

		forEach(getParsedRules(styles.rules), (rule: string) => {
			render.beginning.add(`template.insertStyleRule("${rule}");`);
		});

		forEach(styles.mediaRules, (media: css.CSSNodeMediaRule) => {
			render.beginning.add(`template.insertStyleRule("@media ${media.prelude} {${getParsedRules(media.rules).join(' ')}}");`);
		});
	}


	private findStylesForElement(el: ASTHTMLNodeElement, matcher: Matcher): Array<CSSRuleBuffer>
	{
		let result: Array<CSSRuleBuffer> = [];

		const findInRules = (rules: Array<css.CSSNodeRule>) => {
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
		};

		forEach(this.styles, (styles: css.CSSNodeStylesheet) => {
			findInRules(styles.rules);

			forEach(styles.mediaRules, (media: css.CSSNodeMediaRule) => {
				findInRules(media.rules);
			});
		});

		return result;
	}


	private getSelectorReplacement(buffer: CSSRuleBuffer): string
	{
		const selector = this.splitSelector(buffer.selector.value);

		if (!exists(this.selectors[selector.selector])) {
			const replacement = this.createSelectorReplacementName();

			forEach(buffer.rule.selectors, (selector: css.CSSNodeSelector) => {
				const sibling = this.splitSelector(selector.value);

				this.selectors[sibling.selector] = replacement;
			});
		}

		return this.selectors[selector.selector];
	}


	private splitSelector(selector: string): {selector: string, pseudoElement: string}
	{
		const parts = selector.split('::');

		return {
			selector: parts[0],
			pseudoElement: exists(parts[1]) ? parts[1] : null,
		};
	}


	private createSelectorReplacementName(): string
	{
		return `${STYLE_ATTRIBUTE_PREFIX}_${this.name}_${keys(this.selectors).length}`;
	}

}
