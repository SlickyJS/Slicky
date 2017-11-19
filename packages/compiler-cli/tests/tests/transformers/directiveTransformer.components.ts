import {fsModuleResolutionHost} from '@slicky/typescript-api-utils';
import {createDirectiveTransformer, createFilterTransformer} from '../../../transformers';
import {FileDefinition} from '../../../analyzers';
import {createSourceFileFactory, createFileFactory, createTransformationResult, createFileAnalyzer} from '../../helpers';
import * as ts from 'typescript';
import * as path from 'path';
import {expect} from 'chai';


const createFile = createFileFactory(['transformers', 'directiveTransformer.components']);
const createSourceFile = createSourceFileFactory(['transformers', 'directiveTransformer.components']);


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


describe('#Transformers/DirectiveTransformer.components', () => {

	it('should transform simple component class', () => {
		compareSource('valid_1', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

	it('should transform component with template from html file', () => {
		compareSource('valid_2', (file) => {
			expect(file.dependencies).to.be.eql([
				path.normalize(path.join(__dirname, '..', '..', 'data', 'transformers', 'directiveTransformer.components', 'valid_2.template.html')),
			]);
		});
	});

	it('should transform component with inner directive and @ChildDirective()', () => {
		compareSource('valid_3', (file) => {
			expect(file.dependencies).to.be.eql([]);
		});
	});

	it('should transform component with inner directive and @ChildDirective() from imported file', () => {
		compareSource('valid_4', (file) => {
			expect(file.dependencies).to.be.eql([
				path.normalize(path.join(__dirname, '..', '..', 'data', 'transformers', 'directiveTransformer.components', 'valid_4.childDirective.ts')),
			]);
		});
	});

});
