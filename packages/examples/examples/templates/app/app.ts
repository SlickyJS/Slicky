import {Component} from '@slicky/core';


@Component({
	selector: 'app',
	template: require('./appTemplate.html'),
})
export class AppComponent
{


	public greeting: string = 'Hello';

	public name: string = 'David';

}
