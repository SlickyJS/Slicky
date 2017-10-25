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
