import {Colors, ColorBrightnessType} from '../utils';


let TODOS_COUNTER = 0;


export class Todo
{


	public static TEXT_LIGHT: string = '#ffffff';
	public static TEXT_DARK: string = '#000000';


	public id: number;

	public done: boolean = false;

	public text: string;

	public color: string = '#ffc70e';

	public textColor: string = Todo.TEXT_LIGHT;


	constructor(text: string)
	{
		this.id = TODOS_COUNTER++;
		this.text = text;
	}


	public toggle(): void
	{
		this.done = !this.done;
	}


	public setColor(color: string): void
	{
		this.color = color;
		this.textColor = Colors.getBrightnessType(this.color) === ColorBrightnessType.Light ? Todo.TEXT_DARK : Todo.TEXT_LIGHT;
	}


	public update(todo: Todo): Todo
	{
		this.text = todo.text;
		this.setColor(todo.color);

		return this;
	}


	public clone(): Todo
	{
		let todo = new Todo(this.text);
		todo.setColor(this.color);

		return todo;
	}

}
