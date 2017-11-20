import {lookupParentClasses, lookupDeepParentClasses, mockModuleResolutionHost} from '../../../';
import {expect} from 'chai';
import * as ts from 'typescript';


describe('#classes/lookupParentClass', () => {

	describe('lookupParentClasses()', () => {

		it('should return undefined when class does not have a parent', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile('/index.ts', 'class A {}', ts.ScriptTarget.Latest, true);

			// class A {}
			const classDeclaration = <ts.ClassDeclaration>sourceFile.statements[0];

			expect(lookupParentClasses(classDeclaration, {}, mockModuleResolutionHost())).to.be.eql({
				parents: [],
			});
		});

		it('should return parent class', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile(
				'/index.ts',
				(
					'class A {}\n' +
					'class B {}\n' +
					'class C {}\n' +
					'class D extends A, B extends C {}'
				),
				ts.ScriptTarget.Latest,
				true
			);

			// class D extends A, B extends C {}
			const classDeclaration = <ts.ClassDeclaration>sourceFile.statements[3];

			const parentClass = lookupParentClasses(classDeclaration, {}, mockModuleResolutionHost());

			expect(parentClass.parents).to.have.length(3);
			expect(parentClass.parents[0].originalName).to.be.equal('A');
			expect(parentClass.parents[1].originalName).to.be.equal('B');
			expect(parentClass.parents[2].originalName).to.be.equal('C');
			expect(parentClass.parents[0].node).to.be.equal(sourceFile.statements[0]);
			expect(parentClass.parents[1].node).to.be.equal(sourceFile.statements[1]);
			expect(parentClass.parents[2].node).to.be.equal(sourceFile.statements[2]);
		});

	});

	describe('lookupDeepParentClasses()', () => {

		it('should return parent class', () => {
			const sourceFile = <ts.SourceFile>ts.createSourceFile(
				'/index.ts',
				(
					'class A1 {}\n' +
					'class A2 extends A1 {}\n' +
					'class A extends A2 {}\n' +
					'class B1 {}\n' +
					'class B2 extends B1 {}\n' +
					'class B extends B2 {}\n' +
					'class C1 {}\n' +
					'class C2 extends C1 {}\n' +
					'class C extends C2 {}\n' +
					'class D extends A, B extends C {}'
				),
				ts.ScriptTarget.Latest,
				true
			);

			// class D extends A, B extends C {}
			const classDeclaration = <ts.ClassDeclaration>sourceFile.statements[9];

			const parentClass = lookupDeepParentClasses(classDeclaration, {}, mockModuleResolutionHost());

			expect(parentClass.parents).to.have.length(9);
			expect(parentClass.parents[0].originalName).to.be.equal('A');
			expect(parentClass.parents[1].originalName).to.be.equal('B');
			expect(parentClass.parents[2].originalName).to.be.equal('C');
			expect(parentClass.parents[3].originalName).to.be.equal('A2');
			expect(parentClass.parents[4].originalName).to.be.equal('A1');
			expect(parentClass.parents[5].originalName).to.be.equal('B2');
			expect(parentClass.parents[6].originalName).to.be.equal('B1');
			expect(parentClass.parents[7].originalName).to.be.equal('C2');
			expect(parentClass.parents[8].originalName).to.be.equal('C1');
			expect(parentClass.parents[0].node).to.be.equal(sourceFile.statements[2]);
			expect(parentClass.parents[1].node).to.be.equal(sourceFile.statements[5]);
			expect(parentClass.parents[2].node).to.be.equal(sourceFile.statements[8]);
			expect(parentClass.parents[3].node).to.be.equal(sourceFile.statements[1]);
			expect(parentClass.parents[4].node).to.be.equal(sourceFile.statements[0]);
			expect(parentClass.parents[5].node).to.be.equal(sourceFile.statements[4]);
			expect(parentClass.parents[6].node).to.be.equal(sourceFile.statements[3]);
			expect(parentClass.parents[7].node).to.be.equal(sourceFile.statements[7]);
			expect(parentClass.parents[8].node).to.be.equal(sourceFile.statements[6]);
		});

	});

});
