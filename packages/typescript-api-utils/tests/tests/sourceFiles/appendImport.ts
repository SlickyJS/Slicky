import {appendImport as _appendImport, fsModuleResolutionHost} from '../../../';
import {expect} from 'chai';
import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';


const PATH = path.join(__dirname, '..', '..', 'data', 'sourceFiles', 'appendImport');


function getFileSource(name: string): ts.SourceFile
{
	const filePath = path.join(PATH, `${name}.ts`);
	const file = <string>fs.readFileSync(filePath, {encoding: 'utf8'});

	return <ts.SourceFile>ts.createSourceFile(filePath, file, ts.ScriptTarget.Latest);
}


function compareSourceFile(name: string, sourceFile: ts.SourceFile): void
{
	const filePath = path.join(PATH, `${name}.ts`);
	const file = <string>fs.readFileSync(filePath, {encoding: 'utf8'});

	const printer = <ts.Printer>ts.createPrinter({
		newLine: ts.NewLineKind.LineFeed,
	});

	expect(printer.printNode(ts.EmitHint.SourceFile, sourceFile, sourceFile)).to.be.equal(file);
}


function appendImport(moduleSpecifier: string, propertyName: string|undefined, name: string, sourceFile: ts.SourceFile, noImportReuseOnDifferentNames: boolean = false): string
{
	return _appendImport(moduleSpecifier, propertyName, name, sourceFile, {}, fsModuleResolutionHost(), noImportReuseOnDifferentNames);
}


describe('#sourceFiles/appendImport', () => {

	describe('appendImport()', () => {

		it('should add import to empty file', () => {
			const sourceFile = getFileSource('valid_1.original');
			const imported = appendImport('/import', undefined, 'A', sourceFile);

			expect(imported).to.be.equal('A');
			compareSourceFile('valid_1.updated', sourceFile);
		});

		it('should add import to existing module specifier', () => {
			const sourceFile = getFileSource('valid_2.original');
			const imported = appendImport('/import', undefined, 'B', sourceFile);

			expect(imported).to.be.equal('B');
			compareSourceFile('valid_2.updated', sourceFile);
		});

		it('should reuse existing import', () => {
			const sourceFile = getFileSource('valid_3.original');
			const imported = appendImport('/import', undefined, 'A', sourceFile);

			expect(imported).to.be.equal('A');
			compareSourceFile('valid_3.updated', sourceFile);
		});

		it('should reuse existing aliased import', () => {
			const sourceFile = getFileSource('valid_4.original');
			const imported = appendImport('/import', undefined, 'A', sourceFile);

			expect(imported).to.be.equal('B');
			compareSourceFile('valid_4.updated', sourceFile);
		});

		it('should throw an error if property names for same aliased imports are different', () => {
			const sourceFile = getFileSource('invalid_1');

			expect(() => {
				appendImport('/import', 'A2', 'B', sourceFile);
			}).to.throw(Error, 'appendImport: can not append new import {A2 as B}. File already contains import with the same name {A1 as B}.');
		});

		it('should add aliased import', () => {
			const sourceFile = getFileSource('valid_5.original');
			const imported = appendImport('/import', 'A', 'B', sourceFile);

			expect(imported).to.be.equal('B');
			compareSourceFile('valid_5.updated', sourceFile);
		});

		it('should add aliased import to existing module specifier', () => {
			const sourceFile = getFileSource('valid_6.original');
			const imported = appendImport('/import', 'B', 'C', sourceFile);

			expect(imported).to.be.equal('C');
			compareSourceFile('valid_6.updated', sourceFile);
		});

		it('should reuse existing import and drop alias name', () => {
			const sourceFile = getFileSource('valid_7.original');
			const imported = appendImport('/import', 'A', 'B', sourceFile);

			expect(imported).to.be.equal('A');
			compareSourceFile('valid_7.updated', sourceFile);
		});

		it('should reuse existing aliased import and drop new alias name', () => {
			const sourceFile = getFileSource('valid_8.original');
			const imported = appendImport('/import', 'A', 'B2', sourceFile);

			expect(imported).to.be.equal('B1');
			compareSourceFile('valid_8.updated', sourceFile);
		});

		it('should add import after the last one', () => {
			const sourceFile = getFileSource('valid_9.original');
			const imported = appendImport('./valid_9.import_2', undefined, 'B', sourceFile);

			expect(imported).to.be.equal('B');
			compareSourceFile('valid_9.updated', sourceFile);
		});

		it('should not reuse import with different names', () => {
			const sourceFile = getFileSource('valid_10.original');
			const imported = appendImport('/import', undefined, 'A', sourceFile, true);

			expect(imported).to.be.equal('A');
			compareSourceFile('valid_10.updated', sourceFile);
		});

		it('should add relative path import', () => {
			const sourceFile = getFileSource('valid_11.original');
			const imported = appendImport('./import', undefined, 'A', sourceFile);

			expect(imported).to.be.equal('A');
			compareSourceFile('valid_11.updated', sourceFile);
		});

		it('should reuse different form of relative path import', () => {
			const sourceFile = getFileSource('valid_12.original');
			const imported = appendImport('./a/../valid_12.import', undefined, 'A', sourceFile);

			expect(imported).to.be.equal('A');
			compareSourceFile('valid_12.updated', sourceFile);
		});

	});

});
