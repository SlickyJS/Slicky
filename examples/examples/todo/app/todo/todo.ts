import {Colors, ColorBrightnessType} from '../utils';


let TODOS_COUNTER = 0;


export const DEFAULT_TODO_COLOR: string = '#ffc70e';


export class Todo
{


	public static TEXT_LIGHT: string = '#ffffff';
	public static TEXT_DARK: string = '#000000';


	public id: number;

	public done: boolean = false;

	public text: string;

	public color: string;

	public textColor: string = Todo.TEXT_LIGHT;

	public createdAt: Date = new Date;


	constructor(text: string, color: string = DEFAULT_TODO_COLOR)
	{
		this.id = TODOS_COUNTER++;
		this.text = text;
		this.setColor(color);
	}


	public toggle(): void
	{
		this.done = !this.done;
	}


	public update(text: string, color: string): Todo
	{
		let todo = new Todo(text, color);

		todo.id = this.id;
		todo.createdAt = this.createdAt;

		return todo;
	}


	private setColor(color: string): void
	{
		this.color = color;
		this.textColor = Colors.getBrightnessType(this.color) === ColorBrightnessType.Light ? Todo.TEXT_DARK : Todo.TEXT_LIGHT;
	}

}
