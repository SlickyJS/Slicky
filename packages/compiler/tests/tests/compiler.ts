import {DirectiveMetadataLoader, Directive} from '@slicky/core';
import {Compiler} from '../../src';

import {expect} from 'chai';


let metadataLoader: DirectiveMetadataLoader;
let compiler: Compiler;


describe('#Compiler', () => {

	beforeEach(() => {
		metadataLoader = new DirectiveMetadataLoader;
		compiler = new Compiler;
	});

	describe('compile()', () => {

		it('should not compile directive', () => {
			@Directive({
				selector: 'div',
			})
			class TestDirective {}

			expect(compiler.compile(metadataLoader.load(TestDirective))).to.be.equal(undefined);
		});

	});

});
