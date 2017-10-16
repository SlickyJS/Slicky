import {forEach, exists} from '@slicky/utils';
import {AbstractPlugin} from './abstractPlugin';


export class AbstractPluginManager
{


	private plugins: Array<AbstractPlugin> = [];


	public register(plugin: AbstractPlugin): void
	{
		this.plugins.push(plugin);
	}


	protected hook(name: string, ...args: Array<any>): any
	{
		forEach(this.plugins, (plugin: AbstractPlugin) => {
			let result = plugin[name](...args);

			if (exists(result)) {
				args[0] = result;
			}
		});

		return args[0];
	}

}
