# Components

Just like with angular, components are [directives](./directives.md) with [templates](./templates.md) and some other 
small changes. For example, `HostEvent` and `HostElement` does not work here.

Also `@Component` does not have the `selector` option like [directive](./directives.md) has. Instead there is `name` 
option for your custom tag name (in example below `<my-component></my-component>`).

**Name must be lowercased, start with letter and contain at least one dash. Numbers are also allowed.**

```typescript
import {Component} from '@slicky/core';

@Component({
	name: 'my-component',
	template: '{{ text }}',
	styles: [
		'button {color: red;}',
	],
})
export class TextComponent
{
	
	
	public text: string = 'hello world';
	
}
```

## Child directive

You can pass ony child directive (or component) automatically into parent.

**This child directive must be always present, so you can't use it with directive inside ot `<template>` element, 
conditions or loops.**

```html
<parent-component></parent-component>
```

```typescript
import {Component, ChildDirective} from '@slicky/core';

@Component({
	selector: 'child-component',
	template: 'child',
})
class ChildComponent
{
}

@Component({
	selector: 'parent-component',
	template: '<child-component></child-component>',
	directives: [ChildComponent],
})
class ParentComponent
{
	
	
	@ChildDirective(ChildComponent)
	public child: ChildComponent;
	
}
```

`@ChildDirective` can be also marked as required:

```typescript
import {Component, ChildDirective, Required} from '@slicky/core';

@Component({ ... })
class ChildComponent
{
}

@Component({ ... })
class ParentComponent
{
	
	
	@ChildDirective(ChildComponent)
	@Required()
	public child: ChildComponent;
	
}
```

## Children directives

Children directives are also used for accessing child directives from parent, but with ability to access also dynamic 
directives. That means that you can access directives inside of `<template>` element, conditions and loops.

```html
<parent-component></parent-component>
```

```typescript
import {Component, OnInit, ChildrenDirective, ChildrenDirectivesStorage} from '@slicky/core';

@Component({
	selector: 'child-component',
	template: 'child',
})
class ChildComponent
{
}

@Component({
	selector: 'parent-component',
	template: '<child-component></child-component>',
	directives: [ChildComponent],
})
class ParentComponent implements OnInit
{
	
	
	@ChildrenDirective(ChildComponent)
	public children = new ChildrenDirectivesStorage<ChildComponent>();
	
	
	public onInit(): void
	{
		this.children.add.subscribe((child: ChildComponent) => {
			console.log('Added new child:');
			console.log(child);
		});
		
		this.children.remove.subscribe((child: ChildComponent) => {
			console.log('Removed child:');
			console.log(child);
		});
	}
	
}
```

## Encapsulation and shadow DOM

Encapsulation mode can be set for each component independently. Default mode is `TemplateEncapsulation.Emulated`.

```typescript
import {Component, TemplateEncapsulation} from '@slicky/core';

@Component({
	name: 'my-component',
	template: '<a class="btn btn-danger">Click</a>',
	styles: [
		'.btn .btn-danger {border: 1px solid red}',
	],
	encapsulation: TemplateEncapsulation.Native,
})
class MyComponent {}
```

### `TemplateEncapsulation.Native`

Writes the HTML and CSS into [shadow dom](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM). This 
method does not change the original CSS and HTML in any way.

**component template:**

```html
<style>
	.btn .btn-danger {
		border: 1px solid red;
	}
</style>

<a class="btn btn-danger">Click</a>
```

### `TemplateEncapsulation.Emulated`

Default mode.

This option takes your styles and put them into `<head></head>`. It also transforms selectors into unique attribute 
selectors.

**`<head></head>` tag:**

```html
<style>
	[__slicky_style_0_0] {
		border: 1px solid red;
	}
</style>
```

**component template:**

```html
<a class="btn btn-danger" __slicky_style_0_0>Click</a>
```

### `TemplateEncapsulation.None`

This one is similar to the previous, but does not change the CSS neither HTML.

**`<head></head>` tag:**

```html
<style>
	.btn .btn-danger {
		border: 1px solid red;
	}
</style>
```

**component template:**

```html
<a class="btn btn-danger">Click</a>
```
