import {stringify, hyphensToCamelCase, camelCaseToHyphens, firstUpper, startsWith, endsWith, includes, hash, indent} from '../..';
import {expect} from 'chai';


describe('#strings', () => {

	describe('stringify()', () => {

		it('should stringify string', () => {
			expect(stringify('hello')).to.be.equal('hello');
		});

		it('should stringify null', () => {
			expect(stringify(null)).to.be.equal('null');
		});

		it('should stringify undefined', () => {
			expect(stringify(undefined)).to.be.equal('undefined');
		});

		it('should stringify object with name', () => {
			expect(stringify({name: 'obj'})).to.be.equal('obj');
		});

		it('should stringify object with toString method', () => {
			expect(stringify({toString: () => 'obj'})).to.be.equal('obj');
		});

	});

	describe('hyphensToCamelCase()', () => {

		it('should transform string with hyphens to camel cased string', () => {
			expect(hyphensToCamelCase('string-with-hyphens')).to.be.equal('stringWithHyphens');
		});

	});

	describe('camelCaseToHyphens()', () => {

		it('should transform string in camel case to string with hyphens', () => {
			expect(camelCaseToHyphens('camelCasedString')).to.be.equal('camel-cased-string');
		});

	});

	describe('firstUpper()', () => {

		it('should upper case first character', () => {
			expect(firstUpper('firstUpper')).to.be.equal('FirstUpper');
		});

	});

	describe('startsWith()', () => {

		it('should return true', () => {
			expect(startsWith('lorem ipsum', 'lorem')).to.be.equal(true);
		});

		it('should return false', () => {
			expect(startsWith('lorem ipsum', 'ipsum')).to.be.equal(false);
		});

		it('should return true with case insensitive option', () => {
			expect(startsWith('lorem ipsum', 'LOREM', false)).to.be.equal(true);
		});

		it('should return false with case insensitive option', () => {
			expect(startsWith('lorem ipsum', 'IPSUM', false)).to.be.equal(false);
		});

	});

	describe('endsWith()', () => {

		it('should return true', () => {
			expect(endsWith('lorem ipsum', 'ipsum')).to.be.equal(true);
		});

		it('should return false', () => {
			expect(endsWith('lorem ipsum', 'lorem')).to.be.equal(false);
		});

		it('should return true with case insensitive option', () => {
			expect(endsWith('lorem ipsum', 'IPSUM', false)).to.be.equal(true);
		});

		it('should return false with case insensitive option', () => {
			expect(endsWith('lorem ipsum', 'LOREM', false)).to.be.equal(false);
		});

	});

	describe('includes()', () => {

		it('should return true', () => {
			expect(includes('lorem ipsum', 'ipsum')).to.be.equal(true);
		});

		it('should return false', () => {
			expect(includes('lorem ipsum', 'test')).to.be.equal(false);
		});

		it('should return true with case insensitive option', () => {
			expect(includes('lorem ipsum', 'IPSUM', false)).to.be.equal(true);
		});

		it('should return false with case insensitive option', () => {
			expect(includes('lorem ipsum', 'TEST', false)).to.be.equal(false);
		});

	});

	describe('hash()', () => {

		it('should hash a string', () => {
			expect(hash('hello world')).to.be.equal(2616892229);
		});

	});

	describe('indent()', () => {

		it('should indent text', () => {
			let original = `
<div>
	<div>
		<span></span>
	</div>
</div>
`;

			let indented = `
		<div>
			<div>
				<span></span>
			</div>
		</div>
`;

			expect(indent(original, 2)).to.be.equal(indented);
		});

		it('should indent text after from second new line', () => {
			let original = `
<div>
	<div>
		<span></span>
	</div>
</div>
`;

			let indented = `
<div>
			<div>
				<span></span>
			</div>
		</div>
`;

			expect(indent(original, 2, '\t', 1)).to.be.equal(indented);
		});

	});

});
