import { Directive, Input, Required } from '@slicky/core';
import { ClassType } from "@slicky/lang";
import { DirectiveDefinition, DirectiveDefinitionType } from "@slicky/core/metadata";
class TestDirective {
    public input;
    public requiredInput;
    public namedInput;
    public namedRequiredInput;
    public static __SLICKY__INNER__DIRECTIVES__: {
        [id: string]: ClassType<any>;
    } = {};
    public static __SLICKY__DIRECTIVE__METADATA__: DirectiveDefinition = {
        type: DirectiveDefinitionType.Directive,
        id: "TestDirective_4121553767",
        className: "TestDirective",
        selector: "test-directive",
        exportAs: [],
        onInit: false,
        onDestroy: false,
        onTemplateInit: false,
        onUpdate: false,
        onAttach: false,
        inputs: [
            { property: "input", name: "input", required: false },
            { property: "requiredInput", name: "required-input", required: true },
            { property: "namedInput", name: "data-named-input", required: false },
            { property: "namedRequiredInput", name: "data-named-required-input", required: true }
        ],
        outputs: [],
        elements: [],
        events: [],
        directives: [],
        childDirectives: [],
        childrenDirectives: []
    };
}
