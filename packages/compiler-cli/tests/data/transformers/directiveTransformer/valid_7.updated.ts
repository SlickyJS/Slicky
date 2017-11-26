import { Directive, OnInit, OnDestroy, OnTemplateInit, OnAttach, OnUpdate } from '@slicky/core';
import { ClassType } from "@slicky/lang";
import { DirectiveDefinition, DirectiveDefinitionType } from "@slicky/core/metadata";
class TestDirective implements OnInit, OnDestroy, OnTemplateInit, OnAttach, OnUpdate {
    public onInit(): void { }
    public onDestroy(): void { }
    public onTemplateInit(): void { }
    public onAttach(): void { }
    public onUpdate(): void { }
    public static __SLICKY__INNER__DIRECTIVES__: {
        [id: string]: ClassType<any>;
    } = {};
    public static __SLICKY__DIRECTIVE__METADATA__: DirectiveDefinition = {
        type: DirectiveDefinitionType.Directive,
        id: "TestDirective_3334978248",
        className: "TestDirective",
        selector: "test-directive",
        exportAs: [],
        onInit: true,
        onDestroy: true,
        onTemplateInit: true,
        onUpdate: true,
        onAttach: true,
        inputs: [],
        outputs: [],
        elements: [],
        events: [],
        directives: [],
        childDirectives: [],
        childrenDirectives: []
    };
}
