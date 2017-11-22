import {fsModuleResolutionHost} from '../../../';
import {expect} from 'chai';
import * as path from 'path';


const PATH = path.join(__dirname, '..', '..', 'data', 'host', 'fsModuleResolutionHost');


describe('#host/fsModuleResolutionHost', () => {

	describe('fileExists()', () => {

		it('should return false', () => {
			expect(fsModuleResolutionHost().fileExists(path.join(PATH, 'unknown'))).to.be.equal(false);
		});

		it('should return true', () => {
			expect(fsModuleResolutionHost().fileExists(path.join(PATH, 'test'))).to.be.equal(true);
		});

	});

	describe('readFile()', () => {

		it('should return undefined', () => {
			expect(fsModuleResolutionHost().readFile(path.join(PATH, 'unknown'))).to.be.equal(undefined);
		});

		it('should return file content', () => {
			expect(fsModuleResolutionHost().readFile(path.join(PATH, 'test'))).to.be.equal('hello world');
		});

	});

	describe('directoryExists()', () => {

		it('should return false', () => {
			expect(fsModuleResolutionHost().directoryExists(path.join(PATH, 'unknown'))).to.be.equal(false);
		});

		it('should return true', () => {
			expect(fsModuleResolutionHost().directoryExists(PATH)).to.be.equal(true);
		});

	});

});
