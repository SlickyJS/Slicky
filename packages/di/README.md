[![NPM version](https://img.shields.io/npm/v/@slicky/di.svg?style=flat-square)](https://www.npmjs.com/package/@slicky/di)

# Slicky/DI

Dependency injection for typescript

## Installation

```
$ npm install @slicky/di
```

Import this code in your bootstrap file:

```typescript
import 'reflect-metadata';
```

## Basic usage

Every service in DI container is ordinary typescript class with `@Injectable()` annotation.

```typescript
import {Container, Injectable} from '@slicky/di';

@Injectable()
class MyService
{
	
	hello()
	{
		console.log('hello');
	}
	
}

let container = new Container;
container.addService(MyService);

let service: MyService = container.get(MyService);
service.hello();
```

If your service depends on another service, it will be automatically autowired.

```typescript
import {Container, Injectable} from '@slicky/di';

@Injectable()
class Logger
{
	
	log(message: string)
	{
		console.log(message);
	}
	
}

@Injectable()
class MyService
{
	
	constructor(private logger: Logger) {}
	
	hello()
	{
		this.logger.log('hello');
	}
	
}

let container = new Container;
container.addService(Logger);
container.addService(MyService);

let service: MyService = container.get(MyService);
service.hello();
```

## Create instance without registering service

Next code will always create new instance of `MyService`.

```typescript
import {Container, Injectable, Inject} from '@slicky/di';

@Injectable()
class Logger
{
	
	log(message: string)
	{
		console.log(message);
	}
	
}

class MyService
{
	
	constructor(@Inject() private logger: Logger) {}
	
	hello()
	{
		this.logger.log('hello');
	}
	
}

let container = new Container;
container.addService(Logger);

let service: MyService = container.create(MyService);
service.hello();
```

## Value service

Useful for configuration options.

```typescript
import {Container, Inject} from '@slicky/di';

class ValueService {}

class Application
{
	
	constructor(@Inject(ValueService) value: string)
	{
		console.log(value);		// output: "some value"
	}
	
}

let container = new Container;
container.addService(ValueService, {
	useValue: 'some value',
});
```

## Factories

```typescript
import {Container} from '@slicky/di';

class MyService {}

let container = new Container;
container.addService(MyService, {
	useFactory: () => new MyService,
});
```

## Aliases

```typescript
import {Container, Injectable} from '@slicky/di';

@Injectable()
class OldService {}
class MyService {}

let container = new Container;
container.addService(OldService);
container.addService(MyService, {
	useExisting: OldService,
});
```

## Using different class

```typescript
import {Container, Injectable} from '@slicky/di';

class MyService {}
class MyBetterService {}

let container = new Container;
container.addService(MyService, {
	useClass: MyBetterService,
});
```

## Forking containers

You can simply create fork of current container with for example some overwritten services.

```typescript
import {Container} from '@slicky/di';

let container = new Container;
let fork = container.fork();
```