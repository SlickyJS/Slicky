export class DirectivesStorage
{


	private directives: Array<any> = [];


	public addDirective(directive: any): void
	{
		this.directives.push(directive);
	}


	public removeDirective(directive: any): void
	{
		this.directives.splice(this.directives.indexOf(directive), 1);
	}


	public getDirectives(): Array<any>
	{
		return this.directives;
	}

}
