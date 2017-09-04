import {Engine} from '../../';

import {expect} from 'chai';
import {readFileSync} from 'fs';


let engine: Engine;


describe('#Engine', () => {

	beforeEach(() => {
		engine = new Engine;
	});

	describe('compile()', () => {

		it('should compile text', () => {
			let template = engine.compile(0, 'hello');

			expect(template.toString()).to.be.equal(readFileSync(__dirname + '/../_compare/engine.compile.text.js', {encoding: 'utf-8'}));
		});

		it('should compile expression', () => {
			let template = engine.compile(0, '{{ a }}');

			expect(template.toString()).to.be.equal(readFileSync(__dirname + '/../_compare/engine.compile.expression.js', {encoding: 'utf-8'}));
		});

		it('should compile simple tree', () => {
			let template = engine.compile(0, '<div><span>Hello <i>world</i></span></div>');

			expect(template.toString()).to.be.equal(readFileSync(__dirname + '/../_compare/engine.compile.simpleTree.js', {encoding: 'utf-8'}));
		});

		it('should compile element with expression attribute', () => {
			let template = engine.compile(0, '<div class="{{ divClass + \' red\' }} highlighted"></div>');

			expect(template.toString()).to.be.equal(readFileSync(__dirname + '/../_compare/engine.compile.expressionAttribute.js', {encoding: 'utf-8'}));
		});

	});

});
