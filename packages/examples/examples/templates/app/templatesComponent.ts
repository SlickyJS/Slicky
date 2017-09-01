import {Component} from '@slicky/core';


@Component({
	selector: 'app',
	template: require('./templatesComponentTemplate.html'),
})
export class TemplatesComponent
{


	public greeting: string = 'Hello';

	public name: string = 'David';

}
