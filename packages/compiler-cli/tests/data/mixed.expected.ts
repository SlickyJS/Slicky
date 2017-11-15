import { Component, Directive } from "@slicky/core";
@Directive({
    selector: "no-export-directive",
})
class NoExportDirective {
}
@Directive({
    selector: "test-directive-a",
})
export class TestDirectiveA {
}
@Directive({
    selector: "test-directive-b",
})
export class TestDirectiveB {
}
@Component({
    selector: "no-export-component",
    template: "",
})
class NoExportComponent {
}
@Component({
    selector: "test-component-a",
    template: function (template, el, component, directivesProvider) {
        var root = template;
    }
})
export class TestComponentA {
}
@Component({
    selector: "test-component-b",
    template: () => { }
})
export class TestComponentB {
}
