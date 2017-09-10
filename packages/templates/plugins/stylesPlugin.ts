import * as css from '@slicky/css-parser';
import {exists, map, forEach} from '@slicky/utils';
import {ASTHTMLNodeElement, ASTHTMLNodeText} from '@slicky/html-parser';
import {EnginePlugin, OnAfterCompileArgument, OnBeforeProcessElementArgument} from '../engine/enginePlugin';
import {createInsertStyleRule, BuilderMethod} from '../builder';


export class StylesPlugin extends EnginePlugin
{


	private parser: css.CSSParser;

	private processedNonStyleTag;


	constructor()
	{
		super();

		this.parser = new css.CSSParser;
	}


	public onAfterCompile(arg: OnAfterCompileArgument): void
	{
		if (exists(arg.options.styles)) {
			const styles = map(arg.options.styles, (style: string) => {
				return this.parser.parse(style);
			});

			forEach(styles, (stylesheet: Array<css.CSSNodeSelector>) => {
				this.addStyles(arg.builder.getMainMethod(), stylesheet);
			});
		}
	}


	public onBeforeProcessElement(element: ASTHTMLNodeElement, arg: OnBeforeProcessElementArgument): ASTHTMLNodeElement
	{
		if (element.name === 'style') {
			if (this.processedNonStyleTag) {
				throw new Error(`Templates: "style" tag must be the first element in template.`);
			}

			const styles = this.parser.parse((<ASTHTMLNodeText>element.childNodes[0]).value);

			this.addStyles(arg.builder.getMainMethod(), styles);

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
