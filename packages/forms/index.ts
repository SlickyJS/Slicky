import {
	ModelDirective, DefaultInputValueAccessor, CheckboxInputValueAccessor, NumberInputValueAccessor,
	SelectInputValueAccessor, SelectMultipleInputValueAccessor, RadioInputValueAccessor
} from './directives';

export {AbstractInputValueAccessor} from './directives';

export const FORM_DIRECTIVES: Array<any> = [
	ModelDirective,
	DefaultInputValueAccessor,
	CheckboxInputValueAccessor,
	NumberInputValueAccessor,
	SelectInputValueAccessor,
	SelectMultipleInputValueAccessor,
	RadioInputValueAccessor,
];
