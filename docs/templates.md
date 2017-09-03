# Templates

Templates in slicky are ordinary HTML files with some additional features.

## Text expressions

Everything between `{{` and `}}` is automatically parsed with [tiny-js](../packages/tiny-js) parser (custom javascript 
parser).

```html
<div class="alert alert-{{ message.type }}">
	{{ message.text }}
</div>
```

## Properties

You can use properties to set elements' data directly (without `setAttribute` method) or pass data into directives' 
[inputs](./directives.md).

Properties in HTML are just normal attributes enclosed in `[` and `]`. Values of these attributes are evaluated as 
javascript. 

```html
<div [innerText]="'hello world'"></div>
``` 

In example above we did the equivalent of `el.innerText = "hello world"`.

This is especially useful for setting image src:

```html
<img [src]="image.path" />
```

styles:

```html
<div [style.color]="color"></div>
```

or classes:

```html
<div [class.alert-danger]="isAlertDanger()"></div>
```

## Events

Events are also HTML attributes, but this time enclosed within `(` and `)`. Values of these attributes are evaluated as 
javascript.

```html
<button (click)="alert('Clicked on button')">Click</button>
```

You can also call `preventDefault` automatically on events, which is useful mainly for `<a>` tags:

```html
<a href="#" (click.prevent)="alert('Clicked on link')">Click</a>
```

## Filters

Doc [here](./filters.md).

## Templates

If you want to reuse some peace of HTML, you can do that with `<template>` tags.

```html
<template id="block" inject="firstName, secondName">
	<div>
		Hello {{ firstName }} {{ secondName }}!
	</div>
</template>

<include selector="#block" [first-name]="'David'" second-name="K."></include>
<include selector="#block" [first-name]="'John'" second-name="D."></include>
```

Code above is actually one of our [examples](../packages/examples/examples/templates). The result HTML would look like 
this:

```html
<div>Hello David K.</div>
<div>Hello John D.</div>
```

As you can see, you can also pass different variables into your templates (just like function arguments). You just need 
to list them in `inject` attribute for `<template>` tag.

## Conditions

Conditions are similar to conditions in angular > 2. They actually create new templates.

To be able to use them on non-template elements, prepend them with `*`. 

```html
<span *s:if="isAllowed()">Delete</span>
```

That code will be transformed into `<template>` element:

```html
<template [s:if]="isAllowed()">
	<span>Delete</span>
</template>
```

## Loops

Loops in slicky are also similar to loops in angular. They also create `<template>` elements.

**For now there is one limitation: only array-like variables are supported, objects are not.**

**Also keep in mind, that only immutables work here, so calling `items.push()` will do nothing. You need to change the 
whole array! You can use use eg. [immutable.js](https://facebook.github.io/immutable-js/) + look at our 
[example](../packages/examples/examples/todo).**

```html
<ul>
	<li *s:for="item of items">
		{{ item }}
	</li>
</ul>
```

or with template:

```html
<ul>
	<template [s:for]="item of items">
		<li>
			{{ item }}
		</li>
	</template>
</ul>
```

### Track by function

By default the change detection check new, updated and removed items by index in array. This is fine for small arrays, 
but slow for larger. Eg. adding new items to beginning of array will mean updating and redrawing all items.

To avoid this, you can use same concept like in angular - track by function. With this, you can provide your own 
tracking value which will be used to determine if item was updated or not.

```typescript
const trackBy = (item: any, index: number) => {
	return item.id;
};
```

```html
<ul>
	<li *s:for="item of items" *s:for-track-by="trackBy">
		{{ item }}
	</li>
</ul>
```

and with templates:

```html
<ul>
	<template [s:for]="item of items" [s:for-track-by]="trackBy">
		<li>
			{{ item }}	
		</li>
	</template>
</ul>
```
