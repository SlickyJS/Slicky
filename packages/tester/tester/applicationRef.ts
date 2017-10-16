export class ApplicationRef
{


	private _document: Document;


	constructor(document: Document)
	{
		this._document = document;
	}


	get document(): Document
	{
		return this._document;
	}

}
