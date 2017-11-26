import { Filter, FilterInterface } from '@slicky/core';
import { FilterMetadata } from "@slicky/core/metadata";
class TestFilter implements FilterInterface {
    public transform(value: any): string {
        return value.toString();
    }
    public static __SLICKY__FILTER__METADATA__: FilterMetadata = {
        className: "TestFilter",
        name: "test-filter"
    };
}
