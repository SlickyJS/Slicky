import {findNode, isClassInstanceOf as _isClassInstanceOf, fsModuleResolutionHost} from '../../../';
import {expect} from 'chai';
import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';


const PATH = path.join(__dirname, '..', '..', 'data', 'classes', 'instanceOf');


function getSourceFile(name: string): ts.SourceFile
{
	const filePath = path.join(PATH, `${name}.ts`);
	const file = <string>fs.readFileSync(filePath, {encoding: 'utf8'});

	return ts.createSourceFile(filePath, file, ts.ScriptTarget.Latest, true);
}


function isClassInstanceOf(classDeclaration: ts.ClassDeclaration, parentClass: ts.ClassDeclaration): boolean
{
	return _isClassInstanceOf(classDeclaration, parentClass, {}, fsModuleResolutionHost());
}


describe('#classes/instanceOf', () => {

	describe('isClassInstanceOf()', () => {

		it('should return false if class B does not extend from class A', () => {
			const sourceFile = getSourceFile('valid_1');
			const classA = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'A', sourceFile);
			const classB = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'B', sourceFile);

			expect(isClassInstanceOf(classB, classA)).to.be.equal(false);
		});

		it('should return true if class B extend from class A and classes are in the same file', () => {
			const sourceFile = getSourceFile('valid_2');
			const classA = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'A', sourceFile);
			const classB = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'B', sourceFile);

			expect(isClassInstanceOf(classB, classA)).to.be.equal(true);
		});

		it('should return true if class B extend from class A and classes are in different files [depth 1]', () => {
			const sourceFileA = getSourceFile('valid_3.classA');
			const sourceFileB = getSourceFile('valid_3');
			const classA = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'A', sourceFileA);
			const classB = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'B', sourceFileB);

			expect(isClassInstanceOf(classB, classA)).to.be.equal(true);
		});

		it('should return true if class B extend from class A and classes are in different files [depth 3]', () => {
			const sourceFileA = getSourceFile('valid_4.classA');
			const sourceFileB = getSourceFile('valid_4');
			const classA = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'A', sourceFileA);
			const classB = findNode<ts.ClassDeclaration>(ts.SyntaxKind.ClassDeclaration, 'B', sourceFileB);

			expect(isClassInstanceOf(classB, classA)).to.be.equal(true);
		});

	});

});
