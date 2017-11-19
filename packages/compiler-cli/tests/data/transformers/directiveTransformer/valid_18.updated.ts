import { Directive } from '@slicky/core';
import { TestChildDirective } from './valid_18.innerDirective';
import { ClassType } from "@slicky/lang";
import { DirectiveDefinition, DirectiveDefinitionType } from "@slicky/core/metadata";
class TestDirective {
    public static __SLICKY__INNER__DIRECTIVES__: {
        [id: string]: ClassType<any>;
    } = {
        "TestChildDirective_3406023051": TestChildDirective
    };
    public static __SLICKY__DIRECTIVE__METADATA__: DirectiveDefinition = {
        type: DirectiveDefinitionType.Directive,
        id: "TestDirective_1224827798",
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
