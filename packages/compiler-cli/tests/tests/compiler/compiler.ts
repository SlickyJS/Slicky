import {Compiler} from '../../../';
import {readFileSync, unlinkSync, existsSync} from 'fs';
import * as path from 'path';

import {expect} from 'chai';


function tsconfig(name: string): string
{
	return path.join(__dirname, '..', '..', '_apps', name, 'tsconfig.json');
}


function clear(): void
{
	if (existsSync(path.join(__dirname, '..', '..', '_apps', 'out', 'aot', 'app-templates-factory.ts'))) {
		unlinkSync(path.join(__dirname, '..', '..', '_apps', 'out', 'aot', 'app-templates-factory.ts'));
	}
}


function loadAoT(name: string): string
{
	return <string>readFileSync(path.join(__dirname, '..', '..', '_apps', name, 'aot', 'app-templates-factory.ts'), {encoding: 'utf-8'});
}


function compareWith(name: string): string
{
	return <string>readFileSync(path.join(__dirname, '..', '..', '_compare', `${name}.ts`), {encoding: 'utf-8'});
}


describe('#Compiler', () => {

	describe('compile()', () => {

		it('should compile component', (done) => {
			(new Compiler).compile(tsconfig('simple'), (outDir: string, factory: string) => {
				expect(factory).to.be.equal(compareWith('compiler.simple'));

				done();
			});
		});

	});

	describe('compileAndWrite()', () => {

		afterEach(() => {
			clear();
		});

		it('should compile component', (done) => {
			(new Compiler).compileAndWrite(tsconfig('out'), (outDir: string, factory: string) => {
				expect(factory).to.be.equal(compareWith('compiler.simple'));
				expect(loadAoT('out')).to.be.equal(compareWith('compiler.simple'));

				done();
			});
		});

	});

});
