import { Component, FilterInterface, TemplateEncapsulation } from '@slicky/core';
import { TestFilter } from './valid_21.filter';
import { ClassType } from "@slicky/lang";
import { DirectiveDefinition, DirectiveDefinitionType } from "@slicky/core/metadata";
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
        id: "TestComponent_384094524",
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
