[![NPM version](https://img.shields.io/npm/v/@slicky/event-emitter.svg?style=flat-square)](https://www.npmjs.com/package/@slicky/event-emitter)

# Slicky/EventEmitter

EventEmitter based on rxjs

## Installation

```
$ npm install @slicky/event-emitter
```

## Usage

```typescript
import {EventEmitter} from '@slicky/event-emitter';

let event = new EventEmitter<string>();

event.subscribe((value: string) => {
	console.log(value);		// output: "hello"
});

event.emit('hello');
```
