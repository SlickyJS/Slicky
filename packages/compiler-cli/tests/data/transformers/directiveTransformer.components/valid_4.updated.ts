import { Component, ChildDirective, FilterInterface, TemplateEncapsulation } from '@slicky/core';
import { TestChildDirective } from './valid_4.childDirective';
import { ClassType } from "@slicky/lang";
import { DirectiveDefinition, DirectiveDefinitionType } from "@slicky/core/metadata";
class TestComponent {
    public child: TestChildDirective;
    public static __SLICKY__FILTERS__: {
        [name: string]: ClassType<FilterInterface>;
    } = {};
    public static __SLICKY__INNER__DIRECTIVES__: {
        [id: string]: ClassType<any>;
    } = {
        "TestChildDirective_71363570": TestChildDirective
    };
    public static __SLICKY__DIRECTIVE__METADATA__: DirectiveDefinition = {
        type: DirectiveDefinitionType.Component,
        id: "TestComponent_2879162539",
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
        childDirectives: [
            { property: "child", required: false, directive: { metadata: TestChildDirective.__SLICKY__DIRECTIVE__METADATA__, directiveType: TestChildDirective } }
        ],
        childrenDirectives: [],
        encapsulation: TemplateEncapsulation.Emulated,
        filters: [],
        styles: [],
        template: function (template, el, component, directivesProvider) {
            var root = template;
            el.addElement("div", {}, function (el) {
                root.createDirectivesStorageTemplate(template, directivesProvider, el, function (template, directivesProvider) {
                    template
                        .addDirective("@directive_0", directivesProvider.getDirectiveTypeByName("TestChildDirective_71363570"), function (directive) {
                        component.child = directive;
                    });
                });
            });
        }
    };
}
