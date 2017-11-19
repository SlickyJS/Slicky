import {FilterAnalyzer} from '../../../analyzers';
import * as ts from 'typescript';
import {expect} from 'chai';


let analyzer: FilterAnalyzer;


describe('#Analyzators/FilterAnalyzer', () => {

	beforeEach(() => {
		analyzer = new FilterAnalyzer;
	});

	it('should return undefined when class does not have a @Filter() decorator and need flag is false', () => {
		const c = <ts.ClassDeclaration>ts.createClassDeclaration([], [], 'TestFilter', [], [], []);

		expect(analyzer.analyzeFilter(c, false)).to.be.equal(undefined);
	});

	it('should throw an error when class does not have a @Filter() decorator and need flag is true', () => {
		const c = <ts.ClassDeclaration>ts.createClassDeclaration([], [], 'TestFilter', [], [], []);

		expect(() => {
			analyzer.analyzeFilter(c);
		}).to.throw(Error, 'Class "TestFilter" is not a valid filter. Please add @Filter() decorator.');
	});

	it('should throw an error when class does not have a valid @Filter() decorator', () => {
		const c = <ts.ClassDeclaration>ts.createClassDeclaration(
			[
				ts.createDecorator(ts.createIdentifier('Filter')),
			],
			[],
			'TestFilter',
			[],
			[],
			[],
		);

		expect(() => {
			analyzer.analyzeFilter(c);
		}).to.throw(Error, 'Class "TestFilter" is not a valid filter. Please add @Filter() decorator.');
	});

	it('should throw an error when missing configuration object for @Filter()', () => {
		const c = <ts.ClassDeclaration>ts.createClassDeclaration(
			[
				ts.createDecorator(ts.createCall(ts.createIdentifier('Filter'), [], [])),
			],
			[],
			'TestFilter',
			[],
			[],
			[],
		);

		expect(() => {
			analyzer.analyzeFilter(c);
		}).to.throw(Error, 'Filter TestFilter: missing metadata configuration object.');
	});

	it('should throw an error when filter has invalid configuration object', () => {
		const c = <ts.ClassDeclaration>ts.createClassDeclaration(
			[
				ts.createDecorator(ts.createCall(ts.createIdentifier('Filter'), [], [
					ts.createLiteral('configuration'),
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
		}).to.throw(Error, 'Filter TestFilter: missing metadata configuration object.');
	});

	it('should analyze filter decorator', () => {
		const c = <ts.ClassDeclaration>ts.createClassDeclaration(
			[
				ts.createDecorator(ts.createCall(ts.createIdentifier('Filter'), [], [
					ts.createObjectLiteral([
						ts.createPropertyAssignment(ts.createIdentifier('name'), ts.createLiteral('revert')),
					]),
				])),
			],
			[],
			'TestFilter',
			[],
			[
				<any>ts.createExpressionWithTypeArguments([], ts.createIdentifier('FilterInterface')),
			],
			[],
		);

		expect(analyzer.analyzeFilter(c)).to.be.eql({
			className: 'TestFilter',
			name: 'revert',
		});
	});

});
