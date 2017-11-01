import {ElementRef, OnAttach, OnDestroy} from '@slicky/core';
import {AbstractFormContainerDirective} from './abstractFormContainerDirective';
import {ValidationErrors} from '../validators';


export abstract class AbstractFormControl<T, U extends Element> implements OnAttach, OnDestroy
{


	public abstract readonly name: string;

	public abstract value: T;

	public abstract readonly valid: boolean;

	public abstract readonly errors: ValidationErrors;


	public abstract getElementRef(): ElementRef<U>;

	public abstract reset(): void;


	private parent: AbstractFormContainerDirective<any>;


	public onAttach(parent: any): void
	{
		if (this.parent) {
			return;
		}

		// cannot use "parent instanceof AbstractFormContainerDirective" because of cyclic imports
		if (parent._isSlickyFormContainerDirective === true) {
			this.parent = parent;
			this.parent.registerControl(this);
		}
	}


	public onDestroy(): void
	{
		if (this.parent) {
			this.parent.unregisterControl(this);
		}
	}

}
