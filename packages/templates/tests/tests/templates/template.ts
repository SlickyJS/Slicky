import '../../bootstrap';

import {JSDOM} from 'jsdom';
import {callMouseEvent} from '@slicky/utils';
import {Renderer} from '../../../dom';
import * as t from '../../../templates';

import {expect} from 'chai';


let app: t.ApplicationTemplate;
let document: Document;
let renderer: Renderer;
let template: t.Template;


describe('#Templates/Template', () => {

	beforeEach(() => {
		app = new t.ApplicationTemplate;
		document = new JSDOM('').window.document;
		renderer = new Renderer(document);
		template = new t.Template(document, renderer, app, app);
	});

	describe('render()', () => {

		it('should render simple template', () => {
			let root = document.createElement('mock-root');

			template.render(root, (template, el) => {
				el.addText('hello world');
			});

			expect(root.innerHTML).to.be.equal(
				`hello world`
			);
		});

		it('should render expression', () => {
			const root = document.createElement('mock-root');

			template.render(root, (template, el) => {
				el.addExpression(() => 'hello world');
			});

			expect(root.innerHTML).to.be.equal(
				`hello world`
			);
		});

		it('should render template', () => {
			const root = document.createElement('mock-root');

			template.render(root, (template, el) => {
				template.declareTemplate('user-name', (template, el) => {
					el.addText(template.getParameter('user').name);
				});

				template.declareTemplate('user-greeting', (template, el) => {
					el.addText('Hello ');
					template.renderTemplate('user-name', {user: template.getParameter('user')});
					el.addText('!');
				});

				template.renderTemplate('user-greeting', {user: {name: 'David'}});
				el.addText(' ');
				template.renderTemplate('user-greeting', {user: {name: 'Clare'}});
			});

			expect(root.innerHTML).to.be.equal(
				`Hello David<!--__tmpl_include_user-name__-->!<!--__tmpl_include_user-greeting__-->` +
				` ` +
				`Hello Clare<!--__tmpl_include_user-name__-->!<!--__tmpl_include_user-greeting__-->`
			);
		});

		it('should render truthy branch of condition', () => {
			const root = document.createElement('mock-root');

			template.render(root, (template) => {
				template.addCondition(() => true, (template, el) => {
					el.addText('yep');
				}, (template, el) => {
					el.addText('noup');
				});
			});

			expect(root.innerHTML).to.be.equal(
				`yep<!--__tmpl_include_@condition_0_onTrue__--><!--__tmpl_include_@condition_0_onFalse__-->`
			);
		});

		it('should render falsy branch of condition', () => {
			const root = document.createElement('mock-root');

			template.render(root, (template) => {
				template.addCondition(() => false, (template, el) => {
					el.addText('yep');
				}, (template, el) => {
					el.addText('noup');
				});
			});

			expect(root.innerHTML).to.be.equal(
				`<!--__tmpl_include_@condition_0_onTrue__-->noup<!--__tmpl_include_@condition_0_onFalse__-->`
			);
		});

		it('should refresh truthy condition', () => {
			const root = document.createElement('mock-root');
			let visible = true;

			template.render(root, (template) => {
				template.addCondition(() => visible, (template, el) => {
					el.addText('hello world');
				});
			});

			expect(root.textContent).to.be.equal('hello world');

			visible = false;
			template.refresh();

			expect(root.textContent).to.be.equal('');

			visible = true;
			template.refresh();

			expect(root.textContent).to.be.equal('hello world');
		});

		it('should refresh loop', () => {
			const root = document.createElement('mock-root');

			let conditionResult = true;

			template.render(root, (template) => {
				template.addCondition(() => conditionResult, (template, el) => {
					el.addText('yep');
				}, (template, el) => {
					el.addText('noup');
				});
			});

			expect(root.innerHTML).to.be.equal(
				`yep<!--__tmpl_include_@condition_0_onTrue__--><!--__tmpl_include_@condition_0_onFalse__-->`
			);

			conditionResult = false;
			template.refresh();

			expect(root.innerHTML).to.be.equal(
				`<!--__tmpl_include_@condition_0_onTrue__-->noup<!--__tmpl_include_@condition_0_onFalse__-->`
			);
		});

		it('should render simple loop', () => {
			const root = document.createElement('mock-root');
			const users = [
				{name: 'David'},
				{name: 'Clare'},
			];

			template.render(root, (template) => {
				template.addLoop({value: 'user'}, () => users, (template, el) => {
					el.addText(`Hello ${template.getParameter('user').name}! `);
				});
			});

			expect(root.innerHTML).to.be.equal(
				`Hello David! Hello Clare! <!--__tmpl_include_@loop_0__-->`
			);
		});

		it('should update loop and use iterator', () => {
			const root = document.createElement('mock-root');

			let loop = ['a', 'b', 'c'];

			template.render(root, (template) => {
				template.addLoop({value: 'letter', iterator: 'iterator'}, () => loop, (template, el) => {
					el.addText(template.getParameter('letter'));

					template.addCondition(() => {
						return !template.getParameter('iterator').isLast();
					}, (template, el) => {
						el.addText(', ');
					});
				});
			});

			expect(root.textContent).to.be.equal('a, b, c');

			loop = ['a', 'b'];
			template.refresh();

			expect(root.textContent).to.be.equal('a, b');

			loop = ['a', 'b', 'c', 'd', 'e'];
			template.refresh();

			expect(root.textContent).to.be.equal('a, b, c, d, e');
		});

		it('should refresh template on dom event', () => {
			const root = document.createElement('mock-root');

			template.render(root, (template, el) => {
				template.setParameter('counter', 0);

				el.addExpression(() => template.getParameter('counter'));
				el.addElement('button', {}, (el, nativeEl) => {
					template.setParameter('btn', nativeEl);

					el.addEvent('click', () => {
						template.updateParameter('counter', (count: number) => count + 1);
					});
				});
			});

			const btn = <Element>template.getParameter('btn');

			expect(root.textContent).to.be.equal('0');

			callMouseEvent(document, btn, 'click');

			expect(root.textContent).to.be.equal('1');

			callMouseEvent(document, btn, 'click');

			expect(root.textContent).to.be.equal('2');
		});

		it('should refresh whole template from embedded template', () => {
			const root = document.createElement('mock-root');

			template.render(root, (template, el) => {
				template.setParameter('counter', 0);

				template.declareTemplate('inner', (template, el) => {
					el.addElement('button', {}, (el, nativeEl) => {
						template.root.setParameter('btn', nativeEl);

						el.addEvent('click', () => {
							template.updateParameter('counter', (count: number) => count + 1);
						});
					});
				});

				el.addExpression(() => template.getParameter('counter'));
				template.renderTemplate('inner');
			});

			const btn = <Element>template.getParameter('btn');

			expect(root.textContent).to.be.equal('0');

			callMouseEvent(document, btn, 'click');

			expect(root.textContent).to.be.equal('1');
		});

		it('should refresh inner template from parent', () => {
			const root = document.createElement('mock-root');

			template.render(root, (template, el) => {
				template.setParameter('counter', 0);

				el.addElement('button', {}, (el, nativeEl) => {
					template.setParameter('btn', nativeEl);

					el.addEvent('click', () => {
						template.updateParameter('counter', (count: number) => count + 1);
					});
				});

				template.declareTemplate('counter', (template, el) => {
					el.addExpression(() => template.getParameter('counter'));
				});

				template.renderTemplate('counter');
			});

			const btn = <Element>template.getParameter('btn');

			expect(root.textContent).to.be.equal('0');

			callMouseEvent(document, btn, 'click');

			expect(root.textContent).to.be.equal('1');
		});

		it('should include styles', () => {
			const root = document.createElement('mock-root');

			expect(document.head.children).to.have.lengthOf(0);

			template.render(root, (template) => {
				template.insertStyleRule('div {color: red; border: none}');
			});

			expect(document.head.children).to.have.lengthOf(1);
			expect(document.head.children[0].nodeName).to.be.equal('STYLE');
		});

		it('should throw an error when using shadow DOM on not supported element', () => {
			const root = document.createElement('li');

			expect(() => {
				template.render(root, {useShadowDOM: true}, () => {});
			}).to.throw(Error, 'Shadow DOM is not supported for element <li>. Only article, aside, blockquote, body, div, footer, h1, h2, h3, h4, h5, h6, header, nav, p, section, span and custom elements with dash in the name are allowed.');
		});

		it('should render custom template in condition', () => {
			const root = document.createElement('mock-root');

			template.render(root, (template) => {
				template.declareTemplate('my-true', (template, el) => {
					el.addText('yep');
				});

				template.declareTemplate('my-false', (template, el) => {
					el.addText('noup');
				});

				template.addCondition(() => true, 'my-true', 'my-false');
			});

			expect(root.innerHTML).to.be.equal(
				`yep<!--__tmpl_include_my-true__--><!--__tmpl_include_my-false__-->`
			);
		});

		it('should render simple loop with custom template', () => {
			const root = document.createElement('mock-root');
			const users = [
				{name: 'David'},
				{name: 'Clare'},
			];

			template.render(root, (template) => {
				template.declareTemplate('my-loop', (template, el) => {
					el.addText(`Hello ${template.getParameter('user').name}! `);
				});

				template.addLoop({value: 'user'}, () => users, 'my-loop');
			});

			expect(root.innerHTML).to.be.equal(
				`Hello David! Hello Clare! <!--__tmpl_include_my-loop__-->`
			);
		});

		it('should render dynamic class name', () => {
			const root = document.createElement('mock-root');

			let value = true;

			template.render(root, (template, el) => {
				el.addElement('div', {}, (el) => {
					el.addDynamicClass('alert', () => value);
				});
			});

			expect(root.innerHTML).to.be.equal(
				`<div class="alert"></div>`
			);

			value = false;
			template.refresh();

			expect(root.innerHTML).to.be.equal(
				`<div class=""></div>`
			);

			value = true;
			template.refresh();

			expect(root.innerHTML).to.be.equal(
				`<div class="alert"></div>`
			);
		});

		it('should render dynamic element attribute', () => {
			const root = document.createElement('mock-root');

			let value = 'David';

			template.render(root, (template, el) => {
				el.addElement('div', {}, (el) => {
					el.setDynamicAttribute('data-name', () => value);
				});
			});

			expect(root.innerHTML).to.be.equal(
				`<div data-name="David"></div>`
			);

			value = 'Clare';
			template.refresh();

			expect(root.innerHTML).to.be.equal(
				`<div data-name="Clare"></div>`
			);

			value = 'David';
			template.refresh();

			expect(root.innerHTML).to.be.equal(
				`<div data-name="David"></div>`
			);
		});

		it('should render and refresh passed parameter in template', () => {
			const root = document.createElement('mock-root');

			template.render(root, (template) => {
				template.setParameter('name', 'David');

				template.declareTemplate('name', (template, el) => {
					el.addExpression(() => template.getParameter('name'));
				});

				template.renderTemplate('name', {}, (template, outer) => {
					outer.watch(() => outer.getParameter('name'), (name) => {
						template.setParameter('name', name);
					});
				});
			});

			expect(root.textContent).to.be.equal('David');

			template.setParameter('name', 'Clare');
			template.refresh();

			expect(root.textContent).to.be.equal('Clare');

			template.setParameter('name', 'David');
			template.refresh();

			expect(root.textContent).to.be.equal('David');
		});

		it('should throw an error when filter does not exists', () => {
			const root = document.createElement('mock-root');

			expect(() => {
				template.render(root, (template) => {
					template.filter('update', 5);
				});
			}).to.throw(Error, 'Filter "update" does not exists.');
		});

		it('should apply a filter from parent template', () => {
			const root = document.createElement('mock-root');

			template.render(root, (template) => {
				template.addFilter('reverse', (modify: string) => {
					return modify.split('').reverse().join('');
				});

				template.declareTemplate('reverse', (template, el) => {
					el.addText(template.filter('reverse', 'Hello world'));
				});

				template.renderTemplate('reverse');
			});

			expect(root.textContent).to.be.equal('dlrow olleH');
		});

		it('should apply a filter from application template', () => {
			const root = document.createElement('mock-root');

			app.addFilter('reverse', (modify: string) => {
				return modify.split('').reverse().join('');
			});

			template.render(root, (template) => {
				template.declareTemplate('reverse', (template, el) => {
					el.addText(template.filter('reverse', 'Hello world'));
				});

				template.renderTemplate('reverse');
			});

			expect(root.textContent).to.be.equal('dlrow olleH');
		});

		it('should apply a filter', () => {
			const root = document.createElement('mock-root');

			template.render(root, (template, el) => {
				app.addFilter('reverse', (modify: string) => {
					return modify.split('').reverse().join('');
				});

				el.addText(template.filter('reverse', 'Hello world'));
			});

			expect(root.textContent).to.be.equal('dlrow olleH');
		});

		it('should not redraw condition with non boolean check', () => {
			const root = document.createElement('mock-root');

			let num = 1;

			template.render(root, (template) => {
				template.addCondition(() => <any>num, (template, el) => {
					el.addText('yes');
				});
			});

			expect(root.textContent).to.be.equal('yes');

			num++;
			template.refresh();

			expect(root.textContent).to.be.equal('yes');
		});

	});

});
