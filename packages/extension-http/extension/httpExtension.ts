import {AbstractExtension} from '@slicky/core';
import {ProviderOptions} from '@slicky/di';
import {Http} from '@slicky/http';
import {HttpOptions} from '@slicky/http/http';


export class HTTPExtension extends AbstractExtension
{


	private options: HttpOptions;


	constructor(options: HttpOptions = {})
	{
		super();

		this.options = options;
	}


	public getServices(): Array<ProviderOptions>
	{
		return [
			{
				service: Http,
				options: {
					useFactory: () => {
						return new Http(this.options);
					},
				},
			},
		];
	}

}
