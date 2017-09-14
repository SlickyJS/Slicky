export class ClassHelper
{


	private el: HTMLElement;

	private className: string;


	constructor(el: HTMLElement, className: string)
	{
		this.el = el;
		this.className = className;
	}


	public check(value: any): void
	{
		if (value && !this.el.classList.contains(this.className)) {
			this.el.classList.add(this.className);

		} else if (!value && this.el.classList.contains(this.className)) {
			this.el.classList.remove(this.className);
		}
	}

}
