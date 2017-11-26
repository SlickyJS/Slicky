import {fsModuleResolutionHost} from '@slicky/typescript-api-utils';
import {Compiler, CompiledFileResult} from '../../../newCompiler';
import {createFileFactory, createFilePathFactory, createFileAnalyzer} from '../../helpers';
import {expect} from 'chai';


const createPath = createFilePathFactory(['compiler']);
const createFile = createFileFactory(['compiler']);


function compileFile(name: string): CompiledFileResult
{
	const moduleResolutionHost = fsModuleResolutionHost();
	const fileAnalyzer = createFileAnalyzer(moduleResolutionHost);
	const compiler = new Compiler(fileAnalyzer, {}, moduleResolutionHost);

	return compiler.compileFile(createPath(name), createFile(name));
}


describe('#Compiler/Compiler', () => {

	it('should compile simple file', () => {
		const compiled = compileFile('valid_1.original');

		expect(compiled.dependencies).to.be.eql([]);
		expect(compiled.sourceText).to.be.equal(createFile('valid_1.updated'));
	});

});
