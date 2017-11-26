import { Directive, ChildDirective, Required } from '@slicky/core';
import { TestChildDirective } from './valid_13.childDirective';
import { ClassType } from "@slicky/lang";
import { DirectiveDefinition, DirectiveDefinitionType } from "@slicky/core/metadata";
class TestDirective {
    public child;
    public requiredChild;
    public static __SLICKY__INNER__DIRECTIVES__: {
        [id: string]: ClassType<any>;
    } = {};
    public static __SLICKY__DIRECTIVE__METADATA__: DirectiveDefinition = {
        type: DirectiveDefinitionType.Directive,
        id: "TestDirective_2072128925",
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
        childDirectives: [
            { property: "child", required: false, directive: { metadata: TestChildDirective.__SLICKY__DIRECTIVE__METADATA__, directiveType: TestChildDirective } },
            { property: "requiredChild", required: true, directive: { metadata: TestChildDirective.__SLICKY__DIRECTIVE__METADATA__, directiveType: TestChildDirective } }
        ],
        childrenDirectives: []
    };
}
