import {exists} from '@slicky/utils';


const ELEMENT_STORAGE = '__slicky_element_ref';


export class ElementRef<T extends HTMLElement>
{


	public nativeElement: T;


	constructor(nativeElement: T)
	{
		this.nativeElement = nativeElement;
	}


	public static getForElement<T extends HTMLElement>(nativeElement: T): ElementRef<T>
	{
		if (exists(nativeElement[ELEMENT_STORAGE])) {
			return nativeElement[ELEMENT_STORAGE];
		}

		return nativeElement[ELEMENT_STORAGE] = new ElementRef(nativeElement);
	}

}
