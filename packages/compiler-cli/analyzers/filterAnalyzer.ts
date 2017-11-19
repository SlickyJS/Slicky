import {exists} from '@slicky/utils';
import {FilterMetadata} from '@slicky/core/metadata';
import * as ts from 'typescript';


export class FilterAnalyzer
{


	private storage: { [className: string]: FilterMetadata } = {};


	public analyzeFilter(filterClass: ts.ClassDeclaration, need: boolean = true): FilterMetadata
	{
		const className = (<ts.Identifier>filterClass.name).text;

		if (exists(this.storage[className])) {
			return this.storage[className];
		}

		const definition = this.analyzeFilterDecorator(className, filterClass);

		if (!exists(definition)) {
			if (need) {
				throw new Error(`Class "${className}" is not a valid filter. Please add @Filter() decorator.`);
			}

			return;
		}

		return this.storage[className] = definition;
	}


	private analyzeFilterDecorator(className: string, filterClass: ts.ClassDeclaration): FilterMetadata
	{

		let filterDecorator: ts.Decorator;

		ts.forEachChild(filterClass, (node: ts.Node) => {
			if (ts.isDecorator(node)) {
				const decorator = <ts.Decorator>node;

				if (ts.isCallExpression(decorator.expression)) {
					const callExpression = <ts.CallExpression>decorator.expression;

					if (ts.isIdentifier(callExpression.expression)) {
						const identifier = <ts.Identifier>callExpression.expression;

						if (identifier.text === 'Filter') {
							filterDecorator = decorator;
						}
					}
				}

			}
		});

		if (!filterDecorator) {
			return;
		}

		const callExpression = <ts.CallExpression>filterDecorator.expression;

		if (!callExpression.arguments.length || !ts.isObjectLiteralExpression(callExpression.arguments[0])) {
			throw new Error(`Filter ${className}: missing metadata configuration object.`);
		}

		const configuration = <ts.ObjectLiteralExpression>callExpression.arguments[0];
		const definition: FilterMetadata = {
			className: className,
			name: '',
		};

		ts.forEachChild(configuration, (configurationProperty: ts.PropertyAssignment) => {
			if (ts.isIdentifier(configurationProperty.name)) {
				const property = <ts.Identifier>configurationProperty.name;

				if (property.text === 'name') {
					if (!ts.isStringLiteral(configurationProperty.initializer)) {
						throw new Error(`Filter ${definition.className}: name should be a string.`);
					}

					definition.name = (<ts.StringLiteral>configurationProperty.initializer).text;
				}
			}
		});

		if (definition.name === '') {
			throw new Error(`Filter ${definition.className}: missing name.`);
		}

		return definition;
	}

}
