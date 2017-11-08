import {exists} from '@slicky/utils';
import {DirectiveDefinitionType} from '@slicky/core/metadata';
import {fork} from 'child_process';
import * as path from 'path';


export declare interface WorkerDirective
{
	file: string,
	type: DirectiveDefinitionType,
	name: string,
	template?: string,
}


export class WorkerWrapper
{


	public processFile(file: string, exports: Array<string>, done: (err: Error, directives: Array<WorkerDirective>) => void): void
	{
		const directives: Array<WorkerDirective> = [];

		const worker = fork(path.join(__dirname, 'compilerWorker.js'), [], {
			env: {
				COMPILE_FILE: file,
				COMPILE_EXPORTS: exports.join(','),
			},
		});

		worker.on('message', (message) => {
			if (exists(message.log)) {
				console.log(JSON.stringify(message.log));
			}

			if (exists(message.error)) {
				done(new Error(message.error), undefined);
			}

			if (exists(message.directive)) {
				directives.push(message.directive);
			}
		});

		worker.on('exit', (code: number) => {
			if (code !== 0) {
				return;
			}

			done(undefined, directives);
		});
	}

}
