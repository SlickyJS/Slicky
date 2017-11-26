import {fsModuleResolutionHost} from '@slicky/typescript-api-utils';
import {createFilterTransformer} from '../../../transformers';
import {createSourceFileFactory, createFileFactory, createTransformationResult, createFileAnalyzer} from '../../helpers';
import * as ts from 'typescript';
import {expect} from 'chai';


const createFile = createFileFactory(['transformers', 'filterTransformer']);
const createSourceFile = createSourceFileFactory(['transformers', 'filterTransformer']);


function compareSource(name: string): void
{
	const sourceFile = createSourceFile(`${name}.original`);
	const transformed = createTransformationResult(sourceFile, [
		createFilterTransformer(createFileAnalyzer(), {}, fsModuleResolutionHost()),
	]).transformed;

	const printer = <ts.Printer>ts.createPrinter({
		newLine: ts.NewLineKind.LineFeed,
	});

	expect(printer.printNode(ts.EmitHint.SourceFile, transformed[0], transformed[0])).to.be.equal(createFile(`${name}.updated`));
}


describe('#Transformers/FilterTransformer', () => {

	it('should transform filter class', () => {
		compareSource('valid');
	});

});
