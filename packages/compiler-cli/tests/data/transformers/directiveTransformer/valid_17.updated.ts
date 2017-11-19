import { Directive } from '@slicky/core';
import { ClassType } from "@slicky/lang";
import { DirectiveDefinition, DirectiveDefinitionType } from "@slicky/core/metadata";
class TestChildDirective {
    public static __SLICKY__INNER__DIRECTIVES__: {
        [id: string]: ClassType<any>;
    } = {};
    public static __SLICKY__DIRECTIVE__METADATA__: DirectiveDefinition = {
        type: DirectiveDefinitionType.Directive,
        id: "TestChildDirective_112079348",
        className: "TestChildDirective",
        selector: "test-child-directive",
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
        childrenDirectives: []
    };
}
const INNER_DIRECTIVES = [TestChildDirective];
const INNER_INNER_DIRECTIVES = [INNER_DIRECTIVES];
class TestDirective {
    public static __SLICKY__INNER__DIRECTIVES__: {
        [id: string]: ClassType<any>;
    } = {
        "TestChildDirective_112079348": TestChildDirective
    };
    public static __SLICKY__DIRECTIVE__METADATA__: DirectiveDefinition = {
        type: DirectiveDefinitionType.Directive,
        id: "TestDirective_2660113817",
        className: "TestDirective",
        selector: "test-directive",
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
        childrenDirectives: []
    };
}
