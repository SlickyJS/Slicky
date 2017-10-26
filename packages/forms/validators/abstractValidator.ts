export declare interface ValidationErrors
{
	[name: string]: any;
}


export abstract class AbstractValidator<T>
{


	public abstract validate(value: T, done: (errors: ValidationErrors|null) => void): void;

}
