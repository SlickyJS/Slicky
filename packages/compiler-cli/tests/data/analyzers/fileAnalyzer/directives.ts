import {Directive} from '@slicky/core';


@Directive({
	selector: 'not-exported-directive',
})
class NotExportedDirective {}


@Directive({
	selector: 'exported-directive',
})
export class ExportedDirective {}
