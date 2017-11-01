[![NPM version](https://img.shields.io/npm/v/@slicky/realm.svg?style=flat-square)](https://www.npmjs.com/package/@slicky/realm)

# Slicky/Realm

Zone.js wrapper

## Installation

```
$ npm install @slicky/realm
```

Include [zone.js](https://github.com/angular/zone.js) into your application.

## Usage

```typescript
import 'zone.js';
import {Realm} from '@slicky/realm';

const parent = new Realm(
	() => {
		console.log('entering call...');
	},
	() => {
		console.log('leaving call...');
	}
);

const child = parent.fork(
	() => {
		console.log('entering child call...');
	},
	() => {
		console.log('leaving child call...');
	}
);
```