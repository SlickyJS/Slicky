import { Directive, HostElement, HostEvent } from '@slicky/core';
import { ClassType } from "@slicky/lang";
import { DirectiveDefinition, DirectiveDefinitionType } from "@slicky/core/metadata";
class TestDirective {
    public el;
    public onClick(): void { }
    public onClickInner(): void { }
    public onClickHostElement(): void { }
    public static __SLICKY__INNER__DIRECTIVES__: {
        [id: string]: ClassType<any>;
    } = {};
    public static __SLICKY__DIRECTIVE__METADATA__: DirectiveDefinition = {
        type: DirectiveDefinitionType.Directive,
        id: "TestDirective_932332703",
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
        elements: [
            { property: "el", selector: "button", required: false }
        ],
        events: [
            { method: "onClick", event: "click" },
            { method: "onClickInner", event: "click", selector: "button" },
            { method: "onClickHostElement", event: "click", selector: "button" }
        ],
        directives: [],
        childDirectives: [],
        childrenDirectives: []
    };
}
