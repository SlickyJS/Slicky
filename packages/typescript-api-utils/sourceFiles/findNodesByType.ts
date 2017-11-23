import * as ts from 'typescript';


export function findNodesByType<T extends ts.Node>(kind: ts.SyntaxKind, sourceFile: ts.SourceFile): Array<T>
{
	const nodes: Array<T> = [];

	function findLoop(parent: ts.Node): void
	{
		ts.forEachChild(parent, (child: ts.Node) => {
			if (child.kind === kind) {
				nodes.push(<T>child);
			}

			findLoop(child);
		});
	}

	findLoop(sourceFile);

	return nodes;
}
