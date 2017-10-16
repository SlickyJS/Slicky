# Testing

## Installation

```bash
$ npm install @slicky/tester
```

## Usage

Package `@slicky/tester` contains simple utility class for bootstrapping new applications in virtual dom. 

It uses the [jsdom](https://github.com/tmpvar/jsdom) package so you don't need to configure headless chrome nor phantom 
js.

```typescript
import 'zone.js';
import 'reflect-metadata';

import {Tester, ApplicationRef} from '@slicky/tester';
import {Component} from '@slicky/core';
import {expect} from 'chai';

@Component({
	name: 'test-component',
	template: '{{ message }}',
})
class TestComponent
{

	public message = 'Hello world';

}

const app = Tester.run('<test-component></test-component>', {
	directives: [TestComponent],
});

expect(app).to.be.an.instanceOf(ApplicationRef);
expect(app.document.body.textContent).to.be.equal('Hello world');
```

*You can use any assertion library you want.*
