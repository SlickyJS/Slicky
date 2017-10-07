import {Component, TemplateEncapsulation} from '@slicky/core';
import {List} from 'immutable';


const TEMPLATE = `
<button (click)="add()">Add</button><br />
<ul *s:if="items.size > 0">
	<li *s:for="item in items" style="display: block;">{{ item }} <button (click)="remove(item)">X</button></li>
</ul>
`;


@Component({
	name: 'app-loop',
	template: TEMPLATE,
	encapsulation: TemplateEncapsulation.Native,
})
export class LoopApp
{


	public items: List<number> = List();

	private count: number = 0;


	public add(): void
	{
		this.items = this.items.push(this.count++);
	}


	public remove(item: number): void
	{
		this.items = this.items.remove(this.items.indexOf(item));
	}

}
