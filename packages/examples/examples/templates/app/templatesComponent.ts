import {Component} from '@slicky/core';


@Component({
	name: 'app-templates',
	template: require('./templatesComponentTemplate.html'),
})
export class TemplatesComponent
{


	public greeting: string = 'Hello';

	public name: string = 'David';

}
