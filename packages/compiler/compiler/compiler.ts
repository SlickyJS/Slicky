import {DirectiveDefinitionType, DirectiveDefinition, DirectiveDefinitionInnerDirective} from '@slicky/core/metadata';
import {Engine} from '@slicky/templates-compiler';
import {exists, isString} from '@slicky/utils';
import {SlickyEnginePlugin} from './slickyEnginePlugin';


export declare type IsDirectiveInstanceOfFunction = (directive: DirectiveDefinitionInnerDirective, checkAgainst: DirectiveDefinitionInnerDirective) => boolean;


export class Compiler
{


	private templates: {[id: string]: string} = {};


	private isDirectiveInstanceOf: IsDirectiveInstanceOfFunction;


	constructor(isDirectiveInstanceOf: IsDirectiveInstanceOfFunction)
	{
		this.isDirectiveInstanceOf = isDirectiveInstanceOf;
	}


	public static createAotCompiler(): Compiler
	{
		return new Compiler((directive, checkAgainst) => {
			return (
				directive.directiveType === checkAgainst.directiveType ||
				directive.directiveType.prototype instanceof checkAgainst.directiveType
			);
		});
	}


	public compile(metadata: DirectiveDefinition): string
	{
		if (exists(this.templates[metadata.id])) {
			return this.templates[metadata.id];
		}

		if (metadata.type === DirectiveDefinitionType.Directive) {
			return;
		}

		if (!isString(metadata.template)) {
			return;
		}

		const engine = this.createEngine(metadata);

		this.templates[metadata.id] = engine.compile(<string>metadata.template, {
			name: metadata.id,
			styles: metadata.styles,
			encapsulation: metadata.encapsulation,
		});

		//console.log(this.templates[metadata.id]);

		return this.templates[metadata.id];
	}


	private createEngine(metadata: DirectiveDefinition): Engine
	{
		const engine = new Engine;

		engine.addPlugin(new SlickyEnginePlugin(this.isDirectiveInstanceOf, metadata));

		return engine;
	}

}
