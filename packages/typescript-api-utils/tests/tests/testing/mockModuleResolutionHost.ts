import {mockModuleResolutionHost} from '../../../';
import {expect} from 'chai';


describe('#testing/mockModuleResolutionHost', () => {

	describe('fileExists()', () => {

		it('should return false', () => {
			expect(mockModuleResolutionHost().fileExists('/unknown.ts')).to.be.equal(false);
		});

		it('should return true', () => {
			expect(mockModuleResolutionHost({
				'/known.ts': '// hello',
			}).fileExists('/known.ts')).to.be.equal(true);
		});

	});

	describe('readFile()', () => {

		it('should return undefined if file does not exists', () => {
			expect(mockModuleResolutionHost().readFile('/unknown.ts')).to.be.equal(undefined);
		});

		it('should return file source', () => {
			expect(mockModuleResolutionHost({
				'/known.ts': '// hello',
			}).readFile('/known.ts')).to.be.equal('// hello');
		});

	});

	describe('directoryExists()', () => {

		it('should return false', () => {
			expect(mockModuleResolutionHost().directoryExists('/unknown')).to.be.equal(false);
		});

		it('should return true', () => {
			expect(mockModuleResolutionHost({}, ['/known']).directoryExists('/known')).to.be.equal(true);
		});

		it('should return true for directory constructed from files list', () => {
			const moduleResolutionHost = mockModuleResolutionHost({
				'/a/b/c/index.ts': '// hello'
			});

			expect(moduleResolutionHost.directoryExists('/')).to.be.equal(true);
			expect(moduleResolutionHost.directoryExists('/a')).to.be.equal(true);
			expect(moduleResolutionHost.directoryExists('/a/b')).to.be.equal(true);
			expect(moduleResolutionHost.directoryExists('/a/b/c')).to.be.equal(true);

			expect(moduleResolutionHost.directoryExists('/unknown')).to.be.equal(false);
		});

	});

});
