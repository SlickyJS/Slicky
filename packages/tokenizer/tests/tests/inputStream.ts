import {InputStream} from '../..';
import {expect} from 'chai';


describe('#InputStream', () => {

	describe('error()', () => {

		it('should throw an error on current location', () => {
			let stream = new InputStream('hello');

			stream.next();
			stream.next();

			expect(() => {
				stream.error('Wrong char');
			}).to.throw(Error, 'Wrong char (pos: 2)');
		});

	});

	describe('current()', () => {

		it('should return current char', () => {
			let stream = new InputStream('hello');

			expect(stream.current()).to.be.equal('h');
		});

	});

	describe('next()', () => {

		it('should go to the next char', () => {
			let stream = new InputStream('hello');

			expect(stream.next()).to.be.equal('h');
			expect(stream.next()).to.be.equal('e');
			expect(stream.next()).to.be.equal('l');
			expect(stream.next()).to.be.equal('l');
			expect(stream.next()).to.be.equal('o');
		});

	});

	describe('eof()', () => {

		it('should signalize end of string', () => {
			expect(new InputStream('').eof()).to.be.equal(true);
		});

		it('should not signalize end of string', () => {
			expect(new InputStream('hello').eof()).to.be.equal(false);
		});

	});

	describe('readWhile()', () => {

		it('should split string by whitespaces', () => {
			let stream = new InputStream('hello world');

			expect(stream.readWhile((ch: string) => ch !== ' ')).to.be.equal('hello');
			expect(stream.readWhile((ch: string) => ch === ' ')).to.be.equal(' ');
			expect(stream.readWhile((ch: string) => ch !== ' ')).to.be.equal('world');
		});

	});

	describe('peek()', () => {

		it('should peek to next charachters', () => {
			let stream = new InputStream('hello');

			expect(stream.peek()).to.be.equal('e');
			expect(stream.peek()).to.be.equal('l');
			expect(stream.peek()).to.be.equal('l');
			expect(stream.peek()).to.be.equal('o');
			expect(stream.peek()).to.be.equal(undefined);
		});

	});

	describe('resetPeek()', () => {

		it('should reset peek position', () => {
			let stream = new InputStream('hello');

			expect(stream.peek()).to.be.equal('e');

			stream.resetPeek();

			expect(stream.peek()).to.be.equal('e');
		});

	});

	describe('isSequenceFollowing()', () => {

		it('should return found sequence', () => {
			let stream = new InputStream('hello');

			expect(stream.isSequenceFollowing('world', 'hello')).to.be.equal('hello');
		});

		it('should return undefined', () => {
			let stream = new InputStream('world');

			expect(stream.isSequenceFollowing('hello', 'david')).to.be.equal(undefined);
		});

	});

	describe('matchSequence()', () => {

		it('should match sequence', () => {
			let stream = new InputStream('hello world');

			expect(stream.matchSequence('world', 'hello')).to.be.equal('hello');
			expect(stream.next()).to.be.equal(' ');
			expect(stream.matchSequence('hello', 'world')).to.be.equal('world');
			expect(stream.eof()).to.be.equal(true);
		});

		it('should not find sequence', () => {
			let stream = new InputStream('world');

			expect(stream.matchSequence('hello', 'david')).to.be.equal(undefined);
			expect(stream.next()).to.be.equal('w');
		});

	});

});
