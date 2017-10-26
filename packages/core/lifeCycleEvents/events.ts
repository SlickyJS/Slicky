import {ClassType} from '@slicky/lang';


export interface OnInit
{


	onInit(): void;

}


export interface OnDestroy
{


	onDestroy(): void;

}


export interface OnTemplateInit
{


	onTemplateInit(): void;

}


export interface OnUpdate
{


	onUpdate(input: string, value: any): void;

}


export interface OnAttach
{


	onAttach(parentDirective: ClassType<any>): void;

}
