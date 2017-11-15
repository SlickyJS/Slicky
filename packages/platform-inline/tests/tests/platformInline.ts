import '../bootstrap';

import {Component} from '@slicky/core';
import {DirectiveMetadataLoader} from '@slicky/core/metadata';
import {ExtensionsManager} from '@slicky/core/extensions';
import {PlatformInline} from '../../';
import {expect} from 'chai';


let platform: PlatformInline;
let metadataLoader: DirectiveMetadataLoader;


describe('#PlatformInline', () => {

	beforeEach(() => {
		platform = new PlatformInline;
		metadataLoader = new DirectiveMetadataLoader(new ExtensionsManager);
	});

	describe('compileComponentTemplate()', () => {

		it('should throw an error', () => {
			@Component({
				selector: 'test-component',
				template: '',
			})
			class TestComponent {}

			const metadata = metadataLoader.loadDirective(TestComponent);

			expect(() => {
				platform.compileComponentTemplate(metadata);
			}).to.throw(Error, '@slicky/platform-inline can not compile component TestComponent. Precompile your templates with @slicky/compiler-cli or @slicky/webpack-loader. Or you can use @slicky/platform-browser instead.');
		});

	});

});
