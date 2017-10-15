# Bootstrap application

To start using slicky, you'll have to create the `bootstrap.ts` file which will start the application.

Example below shows only the basic setup with components rendered on browser. This is not ideal for production where 
[ahead of time compilation](./aot.md) would be better.

**bootstrap.ts:**

In this file you create two base parts of whole application. Container for dependency injection which is described 
better [here](./di.md) and application itself.

```typescript
import 'zone.js';
import 'reflect-metadata';

import {Container} from '@slicky/di';
import {Application} from '@slicky/application';
import {PlatformBrowser} from '@slicky/platform-browser';

const container = new Container;
const platform = new PlatformBrowser;
const app = new Application(container, {
	directives: [],			// list of your root directives and components
});

// run application in #app element
platform.run(app, '#app');
```

**index.html:**

With this code, slicky will try to find all root [directives](./directives.md) and [components](./components.md) inside 
of `<body>` tag.

```html
<html>
	<body id="app"></body>
</html>
```
