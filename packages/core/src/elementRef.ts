import {exists} from '@slicky/utils';


const ELEMENT_STORAGE = '__slicky_element_ref';


export class ElementRef
{


	public nativeElement: HTMLElement;


	constructor(nativeElement: HTMLElement)
	{
		this.nativeElement = nativeElement;
	}


	public static getForElement(nativeElement: HTMLElement): ElementRef
	{
		if (exists(nativeElement[ELEMENT_STORAGE])) {
			return nativeElement[ELEMENT_STORAGE];
		}

		return nativeElement[ELEMENT_STORAGE] = new ElementRef(nativeElement);
	}

}
