# Slicky/ExtensionTranslator

Slicky extension for localization.

## Installation

```bash
$ npm install --add-prod @slicky/extension-translator
```

Now add it into your `application.ts` file:

```typescript
import {TranslatorExtension} from '@slicky/extension-translator';

// ... create app

app.addExtension(new TranslatorExtension('en'));
```

**You need to provide default language.**

## Documentation

Complete documentation for translator could be found [here](https://github.com/SlickyJS/Translator/blob/master/README.md).

After registering the `TranslatorExtension` you'll be able to use translator in templates or in components:

```typescript
import {Component} from '@slicky/core';
import {ComponentTranslator} from '@slicky/extension-translator';

@Component({
	selector: 'home',
	template: '{{ "home.headline" | translate }}',
	translations: {
		en: {
			home: {
				headline: 'Home headline',
			},
		},
	},
})
class HomeComponent
{
	
	
	constructor(translator: ComponentTranslator)
	{
		console.log(translator.translate('home.headline'));		// "Home headline"
	}
	
}
```

*It's a good idea to put translations for components into their own files.*
