# Bootstrap application

To start using slicky, you'll have to create two files, one for preparing your application and the other for running it. 

The reason why we need to create two files is to be able to precompile your templates on server - this option is 
described in [ahead of time compilation doc](./aot.md) and is fully optional. If you don't want to use AOT (you should) 
you can use only one file.

**application.ts:**

In this file you create two base parts of whole application. Container for dependency injection which is described 
better [here](./di.md) and application itself.

**You need to export instance of `Application` in `APPLICATION` variable.**

```typescript
import {Container} from '@slicky/di';
import {Application} from '@slicky/application';

const container = new Container;
const app = new Application(container, {
	directives: [],			// list of your root directives and components
});

export const APPLICATION = app;
```

**bootstrap.ts:**

```typescript
import {PlatformBrowser} from '@slicky/platform-browser';
import {APPLICATION} from './application';

const platform = new PlatformBrowser;

// run application in #app element
platform.run(APPLICATION, document.getElementById('app'));
```

**index.html:**

With this code, slicky will try to find all root [directives](./directives.md) and [components](./components.md) inside 
of `<body>` tag.

```html
<html>
	<body id="app"></body>
</html>
```
