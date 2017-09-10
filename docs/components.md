# Components

Just like with angular, components are [directives](./directives.md) with [templates](./templates.md) and some other 
small changes. For example, `HostEvent` and `HostElement` does not work here.

```typescript
import {Component} from '@slicky/core';

@Component({
	selector: 'my-component',
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
