import { OnInit } from "@slicky/core";
export declare class CounterDirective implements OnInit {
    counter: HTMLSpanElement;
    btnIncrease: HTMLButtonElement;
    btnDecrease: HTMLButtonElement;
    num: number;
    onInit(): void;
    onBtnIncreaseClick(): void;
    onBtnDecreaseClick(): void;
}
