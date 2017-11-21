import {_checkAndExtractNodeName} from '../resolvers/_utils';
import * as ts from 'typescript';


export function findNode<T extends ts.Node>(kind: ts.SyntaxKind, name: string, sourceFile: ts.SourceFile): T|undefined
{
	function findLoop(parent: ts.Node): T|undefined
	{
		let found: T = undefined;

		ts.forEachChild(parent, (child: ts.Node) => {
			if (found) {
				return;
			}

			if (child.kind === kind) {
				if (_checkAndExtractNodeName(name, child)) {
					found = <T>child;
				}
			}

			const innerFound = findLoop(child);

			if (innerFound) {
				found = innerFound;
			}
		});

		return found;
	}

	return findLoop(sourceFile);
}



