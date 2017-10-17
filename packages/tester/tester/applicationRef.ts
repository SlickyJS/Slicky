import {Application} from '@slicky/application';
import {Container} from '@slicky/di';


export class ApplicationRef
{


	private _application: Application;

	private _container: Container;

	private _document: Document;


	constructor(application: Application, container: Container, document: Document)
	{
		this._application = application;
		this._container = container;
		this._document = document;
	}


	get application(): Application
	{
		return this._application;
	}


	get container(): Container
	{
		return this._container;
	}


	get document(): Document
	{
		return this._document;
	}

}
