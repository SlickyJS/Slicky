# Change detection

Change detection in slicky is really easy, since there is only one rule you need to remember - **use only immutable 
variables**.

The best and easies way to work with immutable types is with [immutable.js](https://facebook.github.io/immutable-js/) 
library. You can look at an example [todo](../packages/examples/examples/todo) app.

## Components

Change detection for [components](./components.md) is always fired after any [life cycle event](./directives.md) and 
any asynchronous call inside of them (ajax, timeout, interval etc.).
 
Sometimes however the call can not be detected automatically. Luckily you can tell slicky to check for changes manually.
 
```typescript
import {Component, OnInit, ChangeDetectorRef} from '@slicky/core';

@Component({
	name: 'my-component',
	template: 'count: {{ count }}',
})
class MyComponent implements OnInit
{
	
	
	public count = 0;
	
	private changeDetector: ChangeDetectorRef;
	
	
	constructor(changeDetector: ChangeDetectorRef)
	{
		this.changeDetector = changeDetector;
	}
	
	
	public onInit(): void
	{
		someUndetectableAsyncCall(() => {
			this.count++;
			this.changeDetector.refresh();
		});
	}
	
}
```
