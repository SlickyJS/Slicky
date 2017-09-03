# Directives

Directive can add some simple behavior to existing DOM elements.

```typescript
import {Directive, ElementRef, HostEvent} from '@slicky/core';

@Directive({
	selector: 'a',
})
export class HoverLinkDirective
{
	
	
	public el: ElementRef;
	
	
	constructor(el: ElementRef)
	{
		this.el = el;
	}
	
	
	@HostEvent('mouseenter')
	public onEnter(): void
	{
		this.el.nativeElement.classList.add('link-hover');
	}
	
	
	@HostEvent('mouseleave')
	public onLeave(): void
	{
		this.el.nativeElement.classList.remove('link-hover');
	}
	
}
```

## ElementRef

`ElementRef` is giving you access to HTML element on which the directive was created.

```html
<div class="my-directive"></div>
```

```typescript
import {Directive, ElementRef} from '@slicky/core';

@Directive({
	selector: '.my-directive',
})
class MyDirective
{
	
	
	constructor(el: ElementRef)
	{
		console.log(el.nativeElement);		// logs the <div class="my-directive"></div>
	}
	
}
```

## HostElement

You can easily access directives' elements with `ElementRef`, but you can also access child elements with `HostElement`.

```html
<div class="my-directive">
	<div class="my-directive-child"></div>
</div>
```

```typescript
import {Directive, HostElement} from '@slicky/core';

@Directive({
	selector: '.my-directive',
})
class MyDirective
{
	
	
	@HostElement('.my-directive-child')
	public child: HTMLDivElement;		// points to <div class="my-directive-child"></div> element
	
}
```

## HostEvent

You can bind events from directive's element or from child elements of your directive.

```html
<div class="my-directive">
	<button></button>
</div>
```

```typescript
import {Directive, HostEvent} from '@slicky/core';

@Directive({
	selector: '.my-directive',
})
class MyDirective
{
	
	
	@HostEvent('mouseenter')
	public onMouseEnter(e: Event): void
	{
		console.log('Event: mouseenter');
	}
	
	
	@HostEvent('button', 'click')
	public onClickButton(e: Event): void
	{
		console.log('Event: click on button');
	}
	
}
```

## Inputs

Directives can be configured from outside by using inputs. Inputs are just like for example arguments in functions.

You can learn more about using properties in [templates](./templates.md) doc.

```html
<div class="my-directive" [data-count]="50" greetings="hello"></div>
```

```typescript
import {Directive, Input, Required} from '@slicky/core';

@Directive({
	selector: '.my-directive',
})
class MyDirective
{
	
	
	@Input('data-count')		// use different name in template
	@Required()			// this input is required
	public count: number = 1;	// will be overridden with 50 from template
	
	@Input()			// use same name in template
	public greetings: string;	// will contain string "hello" from template
	
}
```

## Outputs

Outputs are similar to inputs, but they work in the opposite way. They can notify the template of some event happening 
inside of directive.

```html
<div class="my-directive" (generated)="$this.innerText = $value"></div>
```

*`$this` always refers to current element.*

*`$value` is the value sent from `EventEmitter`.*

```typescript
import {Directive, OnInit, Output} from '@slicky/core';
import {EventEmitter} from '@slicky/event-emitter';

@Directive({
	selector: '.my-directive',
})
class MyDirective implements OnInit
{
	
	
	@Output()
	public generated = new EventEmitter<string>();
	
	
	public onInit(): void
	{
		setInterval(() => {
			this.generated.emit(generateRandomString());
		}, 1000);
	}
	
}
```

Here we used the `OnInit` life cycle callback, these callback are described below.

Also in that example we generate new random string every second and add it into the `innerText` property of our div.

## Life cycle events

These are methods on directives which gives you an option to monitor changes.

```typescript
import {Directive, OnInit, OnDestroy, OnUpdate} from '@slicky/core';

@Directive({
	selector: '.my-directive',
})
class MyDirective implements OnInit, OnDestroy, OnUpdate
{
	
	
	public onInit(): void
	{
		console.log('Directive was created and host events and host elements are ready.');
	}
	
	
	public onDestroy(): void
	{
		console.log('Directive is being removed.');
	}
	
	
	public onUpdate(input: string, value: any): void
	{
		console.log(`Directive.${input} was updated with:`);
		console.log(value);
	}
	
}
```
