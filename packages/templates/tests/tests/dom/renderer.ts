import {callMouseEvent} from '@slicky/utils';
import {JSDOM} from 'jsdom';
import {Renderer} from '../../../dom';

import {expect} from 'chai';


let document: Document;
let renderer: Renderer;


describe('#DOM/Renderer', () => {

	beforeEach(() => {
		document = new JSDOM('').window.document;
		renderer = new Renderer(document);
	});

	describe('appendChild()', () => {

		it('should append child', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');

			renderer.appendChild(parent, child);

			expect(parent.children).to.have.lengthOf(1);
			expect(parent.children[0]).to.be.equal(child);
		});

	});

	describe('insertBefore()', () => {

		it('should insert child before node', () => {
			const parent = document.createElement('div');
			const before = document.createElement('span');
			const child = document.createElement('i');

			parent.appendChild(before);

			renderer.insertBefore(parent, child, before);

			expect(parent.children).to.have.lengthOf(2);
			expect(parent.children[0]).to.be.equal(child);
			expect(parent.children[1]).to.be.equal(before);
		});

	});

	describe('setAttribute()', () => {

		it('should set attribute', () => {
			const node = document.createElement('div');

			renderer.setAttribute(node, 'id', 'main');

			expect(node.getAttribute('id'));
		});

	});

	describe('addEventListener()', () => {

		it('should add event listener', (done) => {
			const node = document.createElement('div');

			node.addEventListener('click', () => {
				done();
			});

			callMouseEvent(document, node, 'click');
		});

	});

});
