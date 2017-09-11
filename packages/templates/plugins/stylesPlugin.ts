import * as css from '@slicky/css-parser';
import {map, forEach} from '@slicky/utils';
import {ASTHTMLNodeElement, ASTHTMLNodeText} from '@slicky/html-parser';
import {EnginePlugin, OnAfterCompileArgument, OnBeforeProcessElementArgument} from '../engine/enginePlugin';
import {createInsertStyleRule, BuilderMethod} from '../builder';


export class StylesPlugin extends EnginePlugin
{


	private processedNonStyleTag;

	private styles: Array<string> = [];


	public onAfterCompile(arg: OnAfterCompileArgument): void
	{
		this.styles = this.styles.concat(arg.options.styles);

		if (this.styles.length) {
			const parser = new css.CSSParser;
			const main = arg.builder.getMainMethod();

			forEach(this.styles, (styles: string) => {
				this.addStyles(main, parser.parse(styles));
			});
		}
	}


	public onBeforeProcessElement(element: ASTHTMLNodeElement, arg: OnBeforeProcessElementArgument): ASTHTMLNodeElement
	{
		if (element.name === 'style') {
			if (this.processedNonStyleTag) {
				throw new Error(`Templates: "style" tag must be the first element in template.`);
			}

			this.styles.push((<ASTHTMLNodeText>element.childNodes[0]).value);

			arg.stopProcessing();

		} else {
			this.processedNonStyleTag = true;
		}

		return element;
	}


	private addStyles(builderMethod: BuilderMethod, stylesheet: Array<css.CSSNodeSelector>): void
	{
		forEach(stylesheet, (selector: css.CSSNodeSelector) => {
			builderMethod.beginning.add(
				createInsertStyleRule(selector.selector, map(selector.rules, (rule: css.CSSNodeRule) => {
					return rule.render();
				}))
			);
		});
	}

}
