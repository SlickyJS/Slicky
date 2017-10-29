import {Container} from '@slicky/di';
import {Application} from '@slicky/application';
import {TranslatorExtension} from '@slicky/extension-translator';


const container = new Container;
const app = new Application(container);

app.addExtension(new TranslatorExtension('en'));


export const todoApp: Application = app;
