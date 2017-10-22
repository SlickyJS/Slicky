import {Engine, TemplateEncapsulation} from '../../';

import {expect} from 'chai';
import {readFileSync} from 'fs';
import * as path from 'path';


function compareWith(name: string): string
{
	return readFileSync(path.join(__dirname, '..', '_compare', `${name}.js`), {encoding: 'utf-8'})
}


let engine: Engine;


describe('#Engine', () => {

	beforeEach(() => {
		engine = new Engine;
	});

	describe('compile()', () => {

		it('should compile text', () => {
			let template = engine.compile('hello');

			expect(template).to.be.equal(compareWith('engine.compile.text'));
		});

		it('should compile expression', () => {
			let template = engine.compile('{{ a }}');

			expect(template).to.be.equal(compareWith('engine.compile.expression'));
		});

		it('should compile simple tree', () => {
			let template = engine.compile('<div><span>Hello <i>world</i></span></div>');

			expect(template).to.be.equal(compareWith('engine.compile.simpleTree'));
		});

		it('should compile element with attributes', () => {
			let template = engine.compile('<div data-id="5" class="{{ divClass + \' red\' }} highlighted"></div>');

			expect(template).to.be.equal(compareWith('engine.compile.attributes'));
		});

		it('should throw an error if selector is missing in include element', () => {
			expect(() => {
				engine.compile('<include></include>');
			}).to.throw(Error, 'Element <include> must have the "selector" attribute for specific <template>.');
		});

		it('should throw an error if selector is missing in include element', () => {
			expect(() => {
				engine.compile('<include selector="#tmpl"></include>');
			}).to.throw(Error, 'Element <include> tries to include unknown <template> with "#tmpl" selector.');
		});

		it('should compile inner templates', () => {
			let template = engine.compile(
				'<template id="app-name" inject="firstName, lastName">{{ firstName }} {{ lastName }}</template>' +
				`<include selector="#app-name" [first-name]="user.david" last-name="K."></include>` +
				`<include selector="#app-name" [first-name]="user.clare" last-name="F."></include>`
			);

			expect(template).to.be.equal(compareWith('engine.compile.templates'));
		});

		it('should compile element events', () => {
			let template = engine.compile('<button (click)="onClick($event)"></button>');

			expect(template).to.be.equal(compareWith('engine.compile.events'));
		});

		it('should compile event with preventDefault', () => {
			let template = engine.compile('<button (click.prevent)="onClick($event)"></button>');

			expect(template).to.be.equal(compareWith('engine.compile.events.prevent'));
		});

		it('should compile element properties', () => {
			let template = engine.compile('<div [style]="getStyles()" [class.alert]="isAlert()"></div>');

			expect(template).to.be.equal(compareWith('engine.compile.properties'));
		});

		it('should export elements', () => {
			let template = engine.compile(
				'<div #a></div>{{ a.innerText }}' +
				'<div #b="$this"></div>{{ b.innerText }}'
			);

			expect(template).to.be.equal(compareWith('engine.compile.exports'));
		});

		it('should throw an error when style tag is not used in the beginning of template', () => {
			expect(() => {
				engine.compile('<span></span><style></style>');
			}).to.throw(Error, 'Templates: "style" tag must be the first element in template.');
		});

		it('should not include unused styles with emulated encapsulation', () => {
			let template = engine.compile('', {
				styles: [
					'div {color: red;}',
				],
			});

			expect(template).to.be.equal(compareWith('engine.compile.styles.unused'));
		});

		it('should import styles from template with emulated encapsulation', () => {
			let template = engine.compile('<style>button, a {color: red; border: none;}</style><button></button><a></a>');

			expect(template).to.be.equal(compareWith('engine.compile.styles.emulated'));
		});

		it('should compile template with native encapsulation', () => {
			let template = engine.compile('hello world', {
				encapsulation: TemplateEncapsulation.Native,
			});

			expect(template).to.be.equal(compareWith('engine.compile.encapsulation.native'));
		});

		it('should compile styles with media queries', () => {
			let template = engine.compile('<span></span>', {
				styles: [
					'@media screen { span {color: red;} }',
				],
			});

			expect(template).to.be.equal(compareWith('engine.compile.styles.media'));
		});

		it('should compile styles with pseudo elements', () => {
			let template = engine.compile('<span><i></i></span><div></div>', {
				styles: [
					'span i::before {font-weight: bold;}',
					'span::after, div::before {color: blue}',
				],
			});

			expect(template).to.be.equal(compareWith('engine.compile.styles.pseudoElements'));
		});

		it('should escape styles correctly', () => {
			let template = engine.compile('<div></div>', {
				styles: [
					'div {font-family: "Helvetica"}',
				],
			});

			expect(template).to.be.equal(compareWith('engine.compile.styles.escape'));
		});

		it('should compile filters', () => {
			let template = engine.compile('{{ 5 | plus : 4 }}');

			expect(template).to.be.equal(compareWith('engine.compile.filters'));
		});

		it('should compile condition', () => {
			let template = engine.compile('<span *s:if="true"></span>');

			expect(template).to.be.equal(compareWith('engine.compile.condition'));
		});

		it('should compile simple loop', () => {
			let template = engine.compile('<li *s:for="item in items"></li>');

			expect(template).to.be.equal(compareWith('engine.compile.loop.simple'));
		});

		it('should compile loop with trackBy', () => {
			let template = engine.compile('<li *s:for="item in items" *s:for-track-by="trackBy"></li>');

			expect(template).to.be.equal(compareWith('engine.compile.loop.trackBy'));
		});

		it('should compile two way data binding', () => {
			let template = engine.compile('<photo [(size)]="photoSize"></photo>');

			expect(template).to.be.equal(compareWith('engine.compile.two-way-binding'));
		});

		it('should create new local variable inside of template', () => {
			let template = engine.compile('{{ let greeting = "hello world" }} {{ greeting }}');

			expect(template).to.be.equal(compareWith('compiler.localVariable'));
		});

	});

});
