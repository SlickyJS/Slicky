import * as ts from 'typescript';


export function _checkAndExtractNodeName(name: string, node: ts.Node): ts.Node|false
{
	if (ts.isVariableStatement(node)) {
		return checkAndExtractVariableStatement(name, <ts.VariableStatement>node);
	}

	if (ts.isClassDeclaration(node)) {
		return checkAndExtractClassDeclaration(name, <ts.ClassDeclaration>node);
	}

	return false;
}


function checkAndExtractVariableStatement(name: string, variableStatement: ts.VariableStatement): ts.Expression|false
{
	let expression: ts.Expression|false = false;

	ts.forEachChild(variableStatement.declarationList, (declaration: ts.VariableDeclaration) => {
		if (expression) {
			return;
		}

		if (ts.isIdentifier(declaration.name) && (<ts.Identifier>declaration.name).text === name) {
			expression = declaration.initializer;
		}
	});

	return expression;
}


function checkAndExtractClassDeclaration(name: string, classDeclaration: ts.ClassDeclaration): ts.ClassDeclaration|false
{
	if ((<ts.Identifier>classDeclaration.name).text === name) {
		return classDeclaration;
	}

	return false;
}
