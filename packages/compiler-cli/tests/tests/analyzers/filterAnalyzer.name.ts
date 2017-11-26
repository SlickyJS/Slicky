import {FilterAnalyzer} from '../../../analyzers';
import * as ts from 'typescript';
import {expect} from 'chai';


let analyzer: FilterAnalyzer;


describe('#Analyzators/FilterAnalyzer.name', () => {

	beforeEach(() => {
		analyzer = new FilterAnalyzer;
	});

	it('should throw an error when @Filter.name is missing', () => {
		const c = <ts.ClassDeclaration>ts.createClassDeclaration(
			[
				ts.createDecorator(ts.createCall(ts.createIdentifier('Filter'), [], [
					ts.createObjectLiteral([]),
				])),
			],
			[],
			'TestFilter',
			[],
			[],
			[],
		);

		expect(() => {
			analyzer.analyzeFilter(c);
		}).to.throw(Error, 'Filter TestFilter: missing name.');
	});

	it('should throw an error when @Filter.name is not valid', () => {
		const c = <ts.ClassDeclaration>ts.createClassDeclaration(
			[
				ts.createDecorator(ts.createCall(ts.createIdentifier('Filter'), [], [
					ts.createObjectLiteral([
						ts.createPropertyAssignment(ts.createIdentifier('name'), ts.createLiteral(10)),
					]),
				])),
			],
			[],
			'TestFilter',
			[],
			[],
			[],
		);

		expect(() => {
			analyzer.analyzeFilter(c);
		}).to.throw(Error, 'Filter TestFilter: name should be a string.');
	});

});
