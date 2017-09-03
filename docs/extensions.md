# Extensions

Extensions are something like a plugins in slicky which you can use to automatically extend the base functionality.

## Writing extension

To write an extension you need to extend `AbstractExtension` class from slicky and add your own methods.

```typescript
import {AbstractExtension, FilterInterface, DirectiveDefinition, DirectiveOptions} from '@slicky/core';
import {Container, ProviderOptions} from '@slicky/di';
import {ClassType} from '@slicky/lang';

class MyExtension extends AbstractExtension
{
	
	
	public getServices(): Array<ProviderOptions>
	{
		return [];		// Register own global services into dependency inject container
	}
	
	
	public getFilters(): Array<ClassType<FilterInterface>>
	{
		return [];		// Add custom global template filters
	}
	
	
	public doUpdateDirectiveMetadata(directiveType: ClassType<any>, metadata: DirectiveDefinition, options: DirectiveOptions): void
	{
		// method is called when metadata is being loaded for some directive
		// you can add your custom metadata or update existing
	}
	
	
	public doUpdateDirectiveServices(directiveType: ClassType<any>, metadata: DirectiveDefinition, services: Array<ProviderOptions>): void
	{
		// method is called when new directive instance is being created
		// you can add custom add custom DI providers or services
	}
	
	
	public doInitComponentContainer(container: Container, metadata: DirectiveDefinition, component: any): void
	{
		// method is called when the DI container is being forked for new component
		// you can register custom services per component
	}
	
}
```
