import {fsModuleResolutionHost} from '@slicky/typescript-api-utils';
import {createDirectiveTransformer, createFilterTransformer} from '../../../transformers';
import {FileDefinition} from '../../../analyzers';
import {createSourceFileFactory, createFileFactory, createFilePathFactory, createTransformationResult, createFileAnalyzer} from '../../helpers';
import * as ts from 'typescript';
import * as path from 'path';
import {expect} from 'chai';


const createPath = createFilePathFactory(['transformers', 'directiveTransformer']);
const createFile = createFileFactory(['transformers', 'directiveTransformer']);
const createSourceFile = createSourceFileFactory(['transformers', 'directiveTransformer']);


function compareSource(name: string, onDone?: (file: FileDefinition) => void): void
{
	const moduleResolutionHost = fsModuleResolutionHost();
	const fileAnalyzer = createFileAnalyzer(moduleResolutionHost);
	const sourceFile = createSourceFile(`${name}.original`);
	const transformed = createTransformationResult(sourceFile, [
		createFilterTransformer(fileAnalyzer, {}, moduleResolutionHost),
		createDirectiveTransformer(fileAnalyzer, {}, moduleResolutionHost, onDone),
	]).transformed;

	const printer = <ts.Printer>ts.createPrinter({
		newLine: ts.NewLineKind.LineFeed,
	});

	expect(printer.printNode(ts.EmitHint.SourceFile, transformed[0], transformed[0])).to.be.equal(createFile(`${name}.updated`));
}


describe('#Transformers/DirectiveTransformer', () => {

	it('should transform simple directive class', () => {
		compareSource('valid_1', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

	it('should transform simple component class', () => {
		compareSource('valid_2', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

	it('should transform directive with override directive from same file', () => {
		compareSource('valid_3', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

	it('should transform directive with override directive from imported file', () => {
		compareSource('valid_4', (file) => {
			expect(file.dependencies).to.be.eql([
				createPath('valid_4.overrideDirective'),
			]);
		});
	});

	it('should transform directive with string exportAs', () => {
		compareSource('valid_5', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

	it('should transform directive with array exportAs', () => {
		compareSource('valid_6', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

	it('should transform directive with life cycle events', () => {
		compareSource('valid_7', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

	it('should transform directive with inputs', () => {
		compareSource('valid_8', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

	it('should transform directive with outputs', () => {
		compareSource('valid_9', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

	it('should transform directive with host elements', () => {
		compareSource('valid_10', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

	it('should transform directive with host events', () => {
		compareSource('valid_11', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

	it('should transform directive with child directives from same file', () => {
		compareSource('valid_12', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

	it('should transform directive with child directives from imported file', () => {
		compareSource('valid_13', (file) => {
			expect(file.dependencies).to.be.eql([
				createPath('valid_13.childDirective'),
			]);
		});
	});

	it('should transform directive with children directives from same file', () => {
		compareSource('valid_14', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

	it('should transform directive with children directives from imported file', () => {
		compareSource('valid_15', (file) => {
			expect(file.dependencies).to.be.eql([
				createPath('valid_15.childrenDirective'),
			]);
		});
	});

	it('should transform directive with inner directives from same file', () => {
		compareSource('valid_16', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

	it('should transform directive with inner directives from array in same file', () => {
		compareSource('valid_17', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

	it('should transform directive with inner directives from imported file', () => {
		compareSource('valid_18', (file) => {
			expect(file.dependencies).to.be.eql([
				createPath('valid_18.innerDirective'),
			]);
		});
	});

	it('should transform directive with inner directives from array in imported file', () => {
		compareSource('valid_19', (file) => {
			expect(file.dependencies).to.be.eql([
				createPath('valid_19.innerDirective'),
			]);
		});
	});

	it('should transform directive with filters from same file', () => {
		compareSource('valid_20', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

	it('should transform directive with filters from imported file', () => {
		compareSource('valid_21', (file) => {
			expect(file.dependencies).to.be.eql([
				createPath('valid_21.filter'),
			]);
		});
	});

	it('should transform directive with styles from imported file', () => {
		compareSource('valid_22', (file) => {
			expect(file.dependencies).to.be.eql([
				path.normalize(path.join(__dirname, '..', '..', 'data', 'transformers', 'directiveTransformer', 'valid_22.styles.css')),
			]);
		});
	});

	it('should transform directive with custom data', () => {
		compareSource('valid_23', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

});
