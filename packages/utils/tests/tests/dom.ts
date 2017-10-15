import {createElement, callMouseEvent} from '../..';
import {expect} from 'chai';
import {JSDOM} from 'jsdom';


let dom;


describe('#dom', () => {

	beforeEach(() => {
		dom = (new JSDOM('<!DOCTYPE html>')).window.document;
	});

	describe('createElement()', () => {

		it('should create new element', () => {
			let el = createElement(dom, '<div id="box"></div>');

			expect(el.nodeName.toLowerCase()).to.be.equal('div');
			expect(el.parentElement).to.be.equal(null);
			expect(el.id).to.be.equal('box');
		});

	});

	describe('callMouseEvent()', () => {

		it('should call mouse event', () => {
			let el = createElement(dom, '<button></button>');
			let called = false;

			el.addEventListener('click', () => {
				called = true;
			});

			callMouseEvent(dom, el, 'click');

			expect(called).to.be.equal(true);
		});

	});

});
