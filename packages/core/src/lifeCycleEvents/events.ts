export interface OnInit
{


	onInit(): void;

}


export interface OnDestroy
{


	onDestroy(): void;

}


export interface OnCheckUpdates
{


	onCheckUpdates(input: string, value: any): any;

}


export interface OnUpdate
{


	onUpdate(input: string, value: any, changes: any): void;

}
