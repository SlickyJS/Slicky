import {exists, stringify, map} from '@slicky/utils';
import {findAnnotation} from '@slicky/reflection';
import {ClassType} from '@slicky/lang';
import {ModuleDefinition} from './module';


export const STATIC_MODULE_METADATA_STORAGE = '__slicky__module__metadata__';


export declare interface ModuleMetadata
{
	directives: Array<ClassType<any>>,
}


export class ModuleMetadataLoader
{


	public loadModule(moduleType: ClassType<any>): ModuleMetadata
	{
		if (!exists(moduleType[STATIC_MODULE_METADATA_STORAGE])) {
			moduleType[STATIC_MODULE_METADATA_STORAGE] = this._loadMetadata(moduleType);
		}

		return moduleType[STATIC_MODULE_METADATA_STORAGE];
	}


	private _loadMetadata(moduleType: ClassType<any>): ModuleMetadata
	{
		const metadata = <ModuleDefinition>findAnnotation(moduleType, ModuleDefinition);

		if (!metadata) {
			throw new Error(`Class "${stringify(moduleType)}" is not a valid module.`);
		}

		return {
			directives: metadata.directives,
		};
	}

}
