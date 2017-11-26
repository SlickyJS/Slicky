import { Component, FilterInterface, TemplateEncapsulation } from '@slicky/core';
import { ClassType } from "@slicky/lang";
import { DirectiveDefinition, DirectiveDefinitionType } from "@slicky/core/metadata";
class TestComponent {
    public name: string = 'John';
    public static __SLICKY__FILTERS__: {
        [name: string]: ClassType<FilterInterface>;
    } = {};
    public static __SLICKY__INNER__DIRECTIVES__: {
        [id: string]: ClassType<any>;
    } = {};
    public static __SLICKY__DIRECTIVE__METADATA__: DirectiveDefinition = {
        type: DirectiveDefinitionType.Component,
        id: "TestComponent_3921432429",
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
            el.addElement("h1", {}, function (el) {
                el.addText("Test");
            });
            el.addText(" ");
            el.addElement("div", {}, function (el) {
                el.addText(" ");
                el.addElement("p", {}, function (el) {
                    el.addText("Hello world, I&apos;m ");
                    el.addExpression(function () {
                        return component.name;
                    });
                });
                el.addText(" ");
            });
            el.addText(" ");
        }
    };
}
