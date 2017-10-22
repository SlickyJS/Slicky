[![NPM version](https://img.shields.io/npm/v/@slicky/http.svg?style=flat-square)](https://www.npmjs.com/package/@slicky/http)

# Slicky/HTTP

Super simple (but advanced) ajax reactive library. Using [RxJS](https://github.com/Reactive-Extensions/RxJS).
Supports sending files.

## Installation

```
$ npm install @slicky/http
```

## Usage

```typescript
import {Http} from '@slicky/http';

const http = new Http;
const data = {number: 5};
const options = {};

http.request('/users', 'GET', data, options).subscribe((response) => {
	console.log(response.json());
});
```

### Shortcuts

```typescript
http.get('/api', data, options).subscribe((response) => {});
http.post('/api', data, options).subscribe((response) => {});
http.files('/api', filesList, data, options).subscribe((response) => {});
```

### Options

* `jsonp`: name of callback for jsonp requests, when `true` is given callback name is used. Default is `false`
* `jsonPrefix`: prefix for json requests. Read more [here](http://stackoverflow.com/questions/2669690/why-does-google-prepend-while1-to-their-json-responses). Default is `null`
* `mimeType`: Default is `null`
* `headers`: List of headers to be send to server. Default is `{}`
* `files`: List of files to be send to server. Default is `[]`

## Queue

By default all your requests are called from queue one by one, so there is always just one request running (or zero).
Inspiration is from this article [http://blog.alexmaccaw.com/queuing-ajax-requests](http://blog.alexmaccaw.com/queuing-ajax-requests).

You can disable this feature with `ImmediateQueue`:

```typescript
import {Http, ImmediateQueue} from '@slicky/http';

const http = new Http({
	queue: new ImmediateQueue
});
```

## Known limitations

* All non ASCII chars (eg. letters with diacritics) in file names are converted to ASCII chars before uploading.