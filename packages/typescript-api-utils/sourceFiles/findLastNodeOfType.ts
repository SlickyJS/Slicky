import * as ts from 'typescript';


export function findLastNodeOfType<T extends ts.Node>(kind: ts.SyntaxKind, sourceFile: ts.SourceFile): T|undefined
{
	let lastNode: T = undefined;

	function findLoop(parent: ts.Node): void
	{
		ts.forEachChild(parent, (child: ts.Node) => {
			if (child.kind === kind) {
				lastNode = <T>child;
			}

			findLoop(child);
		});
	}

	findLoop(sourceFile);

	return lastNode;
}
