import {forEach, exists, isFunction, getType, isArray} from '@slicky/utils';
import {ListDiffer, DifferChange, DifferAction} from '@slicky/change-detection';
import {EmbeddedTemplate, EmbeddedTemplatesContainer} from '../templates';


export class ForOfHelper
{


	private container: EmbeddedTemplatesContainer;

	private item: string;

	private index: string;

	private trackBy: (item: any, index: number) => any;

	private templates: Array<EmbeddedTemplate> = [];

	private differ: ListDiffer<any>;


	constructor(container: EmbeddedTemplatesContainer, item: string, index: string = null, trackBy: (item: any, index: number) => any = null)
	{
		this.container = container;
		this.item = item;
		this.index = index;
		this.trackBy = trackBy || ((item: any, index: number) => index);
		this.container.onDestroy(() => this.destroy());
	}


	public destroy(): void
	{
		forEach(this.templates, (template: EmbeddedTemplate) => {
			template.destroy();
		});

		this.templates = [];
	}


	public check(items: any): void
	{
		// support for immutable.js
		if (isFunction(items.toJS)) {
			items = items.toJS();
		}

		if (!isArray(items)) {
			throw new Error(`ForOfHelper: can process only arrays, "${getType(items)}" given`);
		}

		if (!this.differ) {
			this.differ = new ListDiffer(items, this.trackBy);

			forEach(items, (item, index: number) => {
				this.addItem(index, item);
			});

			return;
		}

		let changes = this.differ.check(items);

		forEach(changes, (change: DifferChange<any>) => {
			switch (change.action) {
				case DifferAction.Add: this.addItem(change.currentIndex, change.currentItem); break;
				case DifferAction.Update: this.updateItem(change.previousIndex, change.currentItem); break;
				case DifferAction.Remove: this.removeItem(change.previousIndex); break;
				case DifferAction.Move: this.moveItem(change.previousIndex, change.currentIndex, change.currentItem); break;
			}
		});
	}


	private addItem(index: number, item: any): void
	{
		this.templates.splice(index, 0, this.container.add(index, (template: EmbeddedTemplate) => {
			this.updateTemplate(template, item, index);
		}));
	}


	private updateItem(previousIndex: number, value: any): void
	{
		if (!exists(this.templates[previousIndex])) {
			return;		// todo: error
		}

		this.updateTemplate(this.templates[previousIndex], value, previousIndex);
	}


	private removeItem(previousIndex: number): void
	{
		if (!exists(this.templates[previousIndex])) {
			return;		// todo: error
		}

		this.container.remove(this.templates[previousIndex]);
		this.templates.splice(previousIndex, 1);
	}


	private moveItem(previousIndex: number, index: number, value: any): void
	{
		if (!exists(this.templates[previousIndex])) {
			return;		// todo: error
		}

		let template = this.templates[previousIndex];

		this.templates.splice(index, 0, this.templates.splice(previousIndex, 1)[0]);

		this.container.move(template, index);
		this.updateTemplate(template, value, index);
	}


	private updateTemplate(template: EmbeddedTemplate, value: any, index: number): void
	{
		template.setParameter(this.item, value);

		if (this.index) {
			template.setParameter(this.index, index);
		}

		template.reload();
	}

}
