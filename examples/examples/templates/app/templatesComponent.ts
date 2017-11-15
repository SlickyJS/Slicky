import {Component} from '@slicky/core';


@Component({
	selector: 'app-templates',
	template: require('./templatesComponentTemplate.html'),
})
export class TemplatesComponent
{


	public greeting: string = 'Hello';

}
