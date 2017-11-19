import {ClassType} from '@slicky/lang';
import {stringify, exists} from '@slicky/utils';
import {findAnnotation} from '@slicky/reflection';
import {FilterDefinition} from './filter';
import {FilterInterface} from '../filters';


export const STATIC_FILTER_METADATA_STORAGE = '__SLICKY__FILTER__METADATA__';


export declare interface FilterMetadata
{
	className: string,
	name: string,
}


export class FilterMetadataLoader
{


	public loadFilter(filterType: ClassType<FilterInterface>): FilterMetadata
	{
		if (!exists(filterType[STATIC_FILTER_METADATA_STORAGE])) {
			filterType[STATIC_FILTER_METADATA_STORAGE] = this._loadMetadata(filterType);
		}

		return filterType[STATIC_FILTER_METADATA_STORAGE];
	}


	private _loadMetadata(filterType: ClassType<any>): FilterMetadata
	{
		const metadata = <FilterDefinition>findAnnotation(filterType, FilterDefinition);

		if (!metadata) {
			throw new Error(`Class "${stringify(filterType)}" is not a valid filter.`);
		}

		return {
			className: stringify(filterType),
			name: metadata.name,
		};
	}

}
