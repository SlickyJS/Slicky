# Forms

## Installation

```bash
$ npm install @slicky/forms
```

## Two-way model binding

By using the `s:model` directive you can let slicky to set and get all form inputs' values. 

```typescript
import {Component} from '@slicky/core';
import {FormModule} from '@slicky/forms';

@Component({
	selector: 'my-form',
	template: '<input type="text" [(s:model)]="name">',
	modules: [FormModule],
})
class FormComponent
{
	
	public name = 'David';
	
}
```

Now you'll always have the same values in `FormComponent.name` and in input's value too.

You can read more about two-way binding [here](./directives.md).

## Validations

```typescript
import {Component} from '@slicky/core';
import {FormModule} from '@slicky/forms';

@Component({
	selector: 'my-form',
	template: 
		'<input type="text" [(s:model)]="name" #input="sModel">' +
		'<ul *s:if="!input.valid">' +
			'<li *s:if="input.errors.required">Please, fill the input.</li>' +
		'</ul>'
	,
	modules: [FormModule],
})
class FormComponent
{
	
	public name = 'David';
	
}
```

***Build in validators:***

* `required`: `<input type="text" s:model required>` - value must not be empty
* `pattern`: `<input type="text" s:model pattern="[a-z]+">` - value must be allowed by pattern
* `email`: `<input type="email" s:model>` - value must be a valid email
* `minLength`: `<input type="text" s:model minlength="10">` - value's length must be greater than 10 letters
* `maxLength`: `<input type="text" s:model maxlength="10">` - value's length must be smaller than 10 letters
* `min`: `<input type="number" s:model min="10">` - value number must be larger than 10
* `max`: `<input type="number" s:model max="10">` - value number must be smaller than 10

## Submitting form

```typescript
import {Component} from '@slicky/core';
import {FormModule, FormDirective} from '@slicky/forms';

declare interface MyFormValues
{
	text?: string,
}

@Component({
	selector: 'my-form',
	template:
	 	'<form (s:submit)="saveForm($event)" novalidate>' +
			'<input name="text" type="text" s:model>' +
		'</form>'
	,
	modules: [FormModule],
})
class FormComponent
{
	
	public saveForm(form: FormDirective<MyFormValues>): void
	{
		console.log(form.values);		// MyFormValues(text: string)
	}
	
}
```

`(s:submit)` overrides the default `submit` event. It would not be called if form is not valid. Also it passes 
instance of `FormDirective` instead of event.

## Input status

All inputs get automatically updated by their current state. You can query the state by using the `s:model` directive 
or style the inputs with automatic css classes.

**Query state:**

```html
<input s:model #input="sModel">

{{ input.touched }}
{{ input.dirty }}
{{ input.pristine }}
{{ input.pending }}
{{ input.valid }}
{{ input.invalid }}
```

**Automatic CSS classes:**

* `s-touched`: Input was visited
* `s-untouched`: Input was not yet visited
* `s-dirty`: Input's value was updated
* `s-pristine`: Input's values was not changed yet
* `s-pending`: Processing input's validators
* `s-valid`: Input's value is valid
* `s-invalid`: Input's value is invalid
