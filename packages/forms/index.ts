import {Module} from '@slicky/core';


import {
	FormDirective, FormContainerDirective, DefaultInputControl, ModelDirective, DefaultInputValueAccessor,
	CheckboxInputValueAccessor, NumberInputValueAccessor, SelectInputValueAccessor, SelectMultipleInputValueAccessor,
	RadioInputValueAccessor
} from './directives';

import {
	RequiredValidator, CheckboxRequiredValidator, EmailValidator, MinLengthValidator, MaxLengthValidator,
	PatternValidator, MinValidator, MaxValidator
} from './validators';

export {AbstractInputValueAccessor, FormDirective} from './directives';
export {AbstractValidator} from './validators';


@Module({
	directives: [
		FormDirective,
		FormContainerDirective,
		DefaultInputControl,
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
	],
})
export class FormModule {}
