import {
	ModelDirective, DefaultInputValueAccessor, CheckboxInputValueAccessor, NumberInputValueAccessor,
	SelectInputValueAccessor, SelectMultipleInputValueAccessor, RadioInputValueAccessor
} from './directives';

import {
	RequiredValidator, CheckboxRequiredValidator, EmailValidator, MinLengthValidator, MaxLengthValidator,
	PatternValidator, MinValidator, MaxValidator
} from './validators';

export {AbstractInputValueAccessor} from './directives';
export {AbstractValidator} from './validators';

export const FORM_DIRECTIVES: Array<any> = [
	RequiredValidator,
	CheckboxRequiredValidator,
	EmailValidator,
	MinLengthValidator,
	MaxLengthValidator,
	PatternValidator,
	MinValidator,
	MaxValidator,
	DefaultInputValueAccessor,
	CheckboxInputValueAccessor,
	NumberInputValueAccessor,
	SelectInputValueAccessor,
	SelectMultipleInputValueAccessor,
	RadioInputValueAccessor,
	ModelDirective,
];
