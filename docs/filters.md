# Filters

Filters are small classes for modifying given data in templates:

```html
{{ article.createdAt | timeAgoInWords }}
```

Code above could be an example of filter for transforming `Date` object into readable string format (eg. `2 minutes ago`).

Filters could be chained and could contain arguments:

```html
{{ message | truncate : 300 : '...' | replace : '_' : '-' }}
```

Here we truncate variable `message` to 300 letters (with `...` at the end) and replacing all `_` with `-`.

You can also wrap any expression into parenthesis to be able to use filters inside:

```html
{{ (5 | plus : 2) / (2 | multiply : 4) }}
```

A bit stupid example, but you get to point :-)

To be able to use a filter in template, you need to specify it for component:

```typescript
import {Component} from '@slicky/core';
import {MyFilter} from './filters';

@Component({
	selector: 'my-component',
	templates: '{{ text | myFilter }}',
	filters: [MyFilter],
})
class MyComponent
{
	
	
	public text: 'Hello world';
	
}
```

## Writing filters

```typescript
import {Filter, FilterInterface} from '@slicky/core';

@Filter({
	name: 'replace',
})
class ReplaceFilter implements FilterInterface
{
	
	
	public transform(value: string, search: string, replace: string): string
	{
		return value.replace(search, replace);
	}
	
}
```
