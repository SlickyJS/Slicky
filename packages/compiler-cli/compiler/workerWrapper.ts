import {exists} from '@slicky/utils';
import {DirectiveDefinitionType} from '@slicky/core/metadata';
import {fork} from 'child_process';
import * as path from 'path';


export declare interface WorkerDirective
{
	file: string,
	type: DirectiveDefinitionType,
	id: string,
	name: string,
	template?: string,
}


export class WorkerWrapper
{


	public processFile(file: string, done: (directives: Array<WorkerDirective>) => void): void
	{
		const directives: Array<WorkerDirective> = [];

		const worker = fork(path.join(__dirname, 'compilerWorker.js'), [], {
			env: {
				COMPILE_FILE: file,
			},
		});

		worker.on('message', (message) => {
			if (exists(message.error)) {
				throw new Error(message.error);
			}

			if (exists(message.directive)) {
				directives.push(message.directive);
			}
		});

		worker.on('exit', (code: number) => {
			if (code !== 0) {
				return;
			}

			done(directives);
		});
	}

}
