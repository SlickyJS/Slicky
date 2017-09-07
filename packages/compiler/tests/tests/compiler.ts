import '../bootstrap';

import {Directive} from '@slicky/core';
import {DirectiveMetadataLoader} from '@slicky/core/metadata';
import {ExtensionsManager} from '@slicky/core/extensions';
import {Compiler} from '../..';

import {expect} from 'chai';


let metadataLoader: DirectiveMetadataLoader;
let compiler: Compiler;


describe('#Compiler', () => {

	beforeEach(() => {
		metadataLoader = new DirectiveMetadataLoader(new ExtensionsManager);
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
