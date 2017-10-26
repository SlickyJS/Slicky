# Forms

## Installation

```bash
$ npm install @slicky/forms
```

## Two-way model binding

By using the `s:model` directive you can let slicky to set and get all form inputs' values. 

```typescript
import {Component} from '@slicky/core';
import {FORM_DIRECTIVES} from '@slicky/forms';

@Component({
	name: 'my-form',
	template: '<input type="text" [(s:model)]="name">',
	directives: [FORM_DIRECTIVES],
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
import {FORM_DIRECTIVES} from '@slicky/forms';

@Component({
	name: 'my-form',
	template: 
		'<input type="text" [(s:model)]="name" #input="sModel">' +
		'<ul *s:if="!input.valid">' +
			'<li *s:if="input.errors.required">Please, fill the input.</li>' +
		'</ul>'
	,
	directives: [FORM_DIRECTIVES],
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
