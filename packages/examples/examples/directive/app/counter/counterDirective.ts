import {Directive, HostElement, HostEvent, Input, OnInit} from "@slicky/core";


@Directive({
	selector: '#app-counter',
})
export class CounterDirective implements OnInit
{


	@HostElement('span.counter-num')
	public counter: HTMLSpanElement;

	@HostElement('.increase')
	public btnIncrease: HTMLButtonElement;

	@HostElement('.decrease')
	public btnDecrease: HTMLButtonElement;

	@Input('data-counter-default')
	public num: number = 0;


	public onInit(): void
	{
		this.counter.innerText = this.num + '';
	}


	@HostEvent('@btnIncrease', 'click')
	public onBtnIncreaseClick(): void
	{
		this.counter.innerText = (++this.num) + '';
	}


	@HostEvent('@btnDecrease', 'click')
	public onBtnDecreaseClick(): void
	{
		this.counter.innerText = (--this.num) + '';
	}

}
