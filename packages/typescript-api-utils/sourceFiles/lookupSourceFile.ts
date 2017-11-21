import * as ts from 'typescript';


export function lookupSourceFile(node: ts.Node): ts.SourceFile
{
	if (ts.isSourceFile(node)) {
		return <ts.SourceFile>node;
	}

	if (!node.parent) {
		throw new Error(`lookupSourceFile: can not get parent for ${ts.SyntaxKind[node.kind]} node.`);
	}

	let parent: ts.Node = node.parent;

	while (parent.parent) {
		parent = parent.parent;
	}

	if (!ts.isSourceFile(parent)) {
		throw new Error(`lookupSourceFile: could not get SourceFile for ${ts.SyntaxKind[node.kind]} node.`);
	}

	return <ts.SourceFile>parent;
}
