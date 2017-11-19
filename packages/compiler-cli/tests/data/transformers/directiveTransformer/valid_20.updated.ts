import { Component, Filter, FilterInterface, TemplateEncapsulation } from '@slicky/core';
import { FilterMetadata, DirectiveDefinition, DirectiveDefinitionType } from "@slicky/core/metadata";
import { ClassType } from "@slicky/lang";
class TestFilter implements FilterInterface {
    public transform(value: any): string {
        return value.toString();
    }
    public static __SLICKY__FILTER__METADATA__: FilterMetadata = {
        className: "TestFilter",
        name: "test-filter"
    };
}
class TestComponent {
    public static __SLICKY__FILTERS__: {
        [name: string]: ClassType<FilterInterface>;
    } = {
        "test-filter": TestFilter
    };
    public static __SLICKY__INNER__DIRECTIVES__: {
        [id: string]: ClassType<any>;
    } = {};
    public static __SLICKY__DIRECTIVE__METADATA__: DirectiveDefinition = {
        type: DirectiveDefinitionType.Component,
        id: "TestComponent_785581821",
        className: "TestComponent",
        selector: "test-component",
        exportAs: [],
        onInit: false,
        onDestroy: false,
        onTemplateInit: false,
        onUpdate: false,
        onAttach: false,
        inputs: [],
        outputs: [],
        elements: [],
        events: [],
        directives: [],
        childDirectives: [],
        childrenDirectives: [],
        encapsulation: TemplateEncapsulation.Emulated,
        filters: [],
        styles: [],
        template: function (template, el, component, directivesProvider) {
            var root = template;
        }
    };
}
