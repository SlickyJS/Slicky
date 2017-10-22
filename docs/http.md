# HTTP

Slicky is using the [@slicky/http](https://github.com/SlickyJS/Slicky/tree/master/packages/http) package which is 
framework agnostic library and so it could be used in any typescript application.

For complete documentation please look [here](https://github.com/SlickyJS/Slicky/blob/master/packages/http/README.md).

## Usage in framework

```bash
$ npm install @slicky/extension-http
```

`bootstrap.ts`:

```typescript
import {HTTPExtension} from '@slicky/extension-http';

// create app instance

app.addExtension(new HTTPExtension({
	// options for Http class
}));
```
