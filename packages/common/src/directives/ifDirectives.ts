import {Directive, Input, Required} from '@slicky/core';


@Directive({
	selector: '[s:if]',
})
export class IfDirectives
{


	@Input('s:if')
	@Required()
	public condition: boolean;

}
