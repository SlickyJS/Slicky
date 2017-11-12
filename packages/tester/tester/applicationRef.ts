import {Application} from '@slicky/core';
import {Container} from '@slicky/di';
import {callDomEvent, callMouseEvent} from '@slicky/utils';


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


	public callEvent(element: Element, type: string, name: string): void
	{
		callDomEvent(this._document, element, type, name);
	}


	public callMouseEvent(element: Element, name: string): void
	{
		callMouseEvent(this._document, element, name);
	}

}
