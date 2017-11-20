import {mockModuleResolutionHost, resolveRawRequire, resolveRequire} from '../../../';
import {expect} from 'chai';


describe('#resolvers/requireResolver', () => {

	describe('resolveRawRequire()', () => {

		it('should return undefined if file does not exists', () => {
			expect(resolveRawRequire('/component.ts', './template.html', mockModuleResolutionHost())).to.be.equal(undefined);
		});

		it('should return file when file exists', () => {
			expect(resolveRawRequire('/component.ts', './template.html', mockModuleResolutionHost({
				'/template.html': '<span></span>',
			}))).to.be.eql({
				path: '/template.html',
				source: '<span></span>',
			});
		});

	});

	describe('resolveRequire()', () => {

		it('should return undefined if file does not exists', () => {
			expect(resolveRequire('/component.ts', './child', {}, mockModuleResolutionHost())).to.be.equal(undefined);
		});

		it('should return file when file exists', () => {
			expect(resolveRequire('/component.ts', './child', {}, mockModuleResolutionHost({
				'/child.ts': '// hello',
			}))).to.be.eql({
				path: '/child.ts',
				source: '// hello',
			});
		});

	});

});
