import {fsModuleResolutionHost} from '@slicky/typescript-api-utils';
import {createDirectiveMetadata, createComponentMetadata, createFileAnalyzer, createSourceFileFactory, createFilePathFactory} from '../../helpers';
import {expect} from 'chai';


const createSourceFile = createSourceFileFactory(['analyzers', 'fileAnalyzer']);
const createFilePath = createFilePathFactory(['analyzers', 'fileAnalyzer']);


describe('#Analyzers/FileAnalyzer', () => {

	describe('analyzeFile()', () => {

		it('should analyze empty file', () => {
			const sourceFile = createSourceFile('empty');

			expect(createFileAnalyzer().analyzeFile(sourceFile)).to.be.eql({
				dependencies: [],
				filters: [],
				directives: [],
			});
		});

		it('should analyze file with filters', () => {
			const sourceFile = createSourceFile('filters');

			expect(createFileAnalyzer().analyzeFile(sourceFile)).to.be.eql({
				dependencies: [],
				filters: [
					{
						exported: false,
						metadata: {
							className: 'NotExportedFilter',
							name: 'not-exported',
						},
					},
					{
						exported: true,
						metadata: {
							className: 'ExportedFilter',
							name: 'exported',
						},
					},
				],
				directives: [],
			});
		});

		it('should analyze file with directives', () => {
			const sourceFile = createSourceFile('directives');

			expect(createFileAnalyzer().analyzeFile(sourceFile)).to.be.eql({
				dependencies: [],
				filters: [],
				directives: [
					{
						exported: false,
						metadata: createDirectiveMetadata({
							id: 'NotExportedDirective_105271944',
							className: 'NotExportedDirective',
							selector: 'not-exported-directive',
						}),
					},
					{
						exported: true,
						metadata: createDirectiveMetadata({
							id: 'ExportedDirective_3764721541',
							className: 'ExportedDirective',
							selector: 'exported-directive',
						}),
					},
				],
			});
		});

		it('should load directive with inner directives from same file', () => {
			const sourceFile = createSourceFile('directive.innerDirectives');

			const childDirectiveMetadata = createDirectiveMetadata({
				id: 'TestChildDirective_1257297583',
				className: 'TestChildDirective',
				selector: 'test-child-directive',
			});

			const analyzed = createFileAnalyzer().analyzeFile(sourceFile, false);

			expect(analyzed).to.be.eql({
				dependencies: [],
				filters: [],
				directives: [
					{
						exported: false,
						metadata: childDirectiveMetadata,
					},
					{
						exported: false,
						metadata: createDirectiveMetadata({
							id: 'TestDirective_438549218',
							directives: [
								{
									localName: 'TestChildDirective',
									originalName: 'TestChildDirective',
									imported: false,
									path: sourceFile.fileName,
									node: undefined,
									metadata: childDirectiveMetadata,
								},
							],
						}),
					},
				],
			});

			expect(analyzed.directives[0].metadata).to.be.equal(analyzed.directives[1].metadata.directives[0].metadata);
		});

		it('should analyze file with inner directives from array', () => {
			const sourceFile = createSourceFile('directives.innerDirectives.array');

			expect(createFileAnalyzer(fsModuleResolutionHost()).analyzeFile(sourceFile, false)).to.be.eql({
				dependencies: [
					createFilePath('directives.innerDirectives.array.index'),
					createFilePath('directives.innerDirectives.array.childDirective'),
				],
				filters: [],
				directives: [
					{
						exported: false,
						metadata: createDirectiveMetadata({
							id: 'TestDirective_3764400614',
							directives: [
								{
									localName: 'TestChildDirective',
									originalName: 'TestChildDirective',
									imported: true,
									path: createFilePath('directives.innerDirectives.array.childDirective'),
									node: undefined,
									metadata: createDirectiveMetadata({
										id: 'TestChildDirective_2585284280',
										className: 'TestChildDirective',
										selector: 'test-child-directive',
									}),
								},
							],
						}),
					},
				],
			});
		});

		it('should load directive with override directive from different file', () => {
			const sourceFile = createSourceFile('directive.override.import');

			expect(createFileAnalyzer(fsModuleResolutionHost()).analyzeFile(sourceFile, false)).to.be.eql({
				dependencies: [
					createFilePath('directive.override.import.base'),
				],
				filters: [],
				directives: [
					{
						exported: false,
						metadata: createDirectiveMetadata({
							id: 'TestDirective_2902471519',
							override: {
								localName: 'TestBaseDirective',
								originalName: 'TestBaseDirective',
								imported: true,
								path: createFilePath('directive.override.import.base'),
								node: undefined,
								metadata: createDirectiveMetadata({
									id: 'TestBaseDirective_2702631665',
									className: 'TestBaseDirective',
								}),
							},
						}),
					},
				],
			});
		});

		it('should load directive with filters from same file', () => {
			const sourceFile = createSourceFile('component.filters');

			expect(createFileAnalyzer().analyzeFile(sourceFile)).to.be.eql({
				dependencies: [],
				filters: [
					{
						exported: false,
						metadata: {
							className: 'TestFilter',
							name: 'test-filter',
						},
					},
				],
				directives: [
					{
						exported: false,
						metadata: createComponentMetadata({
							id: 'TestComponent_1660393203',
							filters: [
								{
									localName: 'TestFilter',
									originalName: 'TestFilter',
									imported: false,
									path: sourceFile.fileName,
									metadata: {
										className: 'TestFilter',
										name: 'test-filter',
									},
								},
							],
						}),
					},
				],
			});
		});

		it('should load directive with filters from imported file', () => {
			const sourceFile = createSourceFile('component.filters.imported');

			expect(createFileAnalyzer(fsModuleResolutionHost()).analyzeFile(sourceFile)).to.be.eql({
				dependencies: [
					createFilePath('component.filters.imported.filter'),
				],
				filters: [],
				directives: [
					{
						exported: false,
						metadata: createComponentMetadata({
							id: 'TestComponent_3936316353',
							filters: [
								{
									localName: 'TestFilter',
									originalName: 'TestFilter',
									imported: true,
									path: createFilePath('component.filters.imported.filter'),
									metadata: {
										className: 'TestFilter',
										name: 'test-filter',
									},
								},
							],
						}),
					},
				],
			});
		});

		it('should load directive with aliased filters from imported file', () => {
			const sourceFile = createSourceFile('component.filters.aliased');

			expect(createFileAnalyzer(fsModuleResolutionHost()).analyzeFile(sourceFile)).to.be.eql({
				dependencies: [
					createFilePath('component.filters.aliased.filter'),
				],
				filters: [],
				directives: [
					{
						exported: false,
						metadata: createComponentMetadata({
							id: 'TestComponent_1903920458',
							filters: [
								{
									localName: 'MyFilter',
									originalName: 'TestFilter',
									imported: true,
									path: createFilePath('component.filters.aliased.filter'),
									metadata: {
										className: 'TestFilter',
										name: 'test-filter',
									},
								},
							],
						}),
					},
				],
			});
		});

	});

});
