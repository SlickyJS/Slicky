import {Component} from '@slicky/core';


@Component({
	selector: 'test-component',
	template: require('./valid_2.template.html'),
})
class TestComponent
{


	public name: string = 'John';

}
