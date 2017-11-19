import { Directive, ChildrenDirective } from '@slicky/core';
import { TestChildDirective } from './valid_15.childrenDirective';
import { ClassType } from "@slicky/lang";
import { DirectiveDefinition, DirectiveDefinitionType } from "@slicky/core/metadata";
class TestDirective {
    public children;
    public static __SLICKY__INNER__DIRECTIVES__: {
        [id: string]: ClassType<any>;
    } = {};
    public static __SLICKY__DIRECTIVE__METADATA__: DirectiveDefinition = {
        type: DirectiveDefinitionType.Directive,
        id: "TestDirective_1520317595",
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
        childrenDirectives: [
            { property: "children", directive: { metadata: TestChildDirective.__SLICKY__DIRECTIVE__METADATA__, directiveType: TestChildDirective } }
        ]
    };
}
