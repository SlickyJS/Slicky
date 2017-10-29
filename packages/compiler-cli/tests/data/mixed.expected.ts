import { Component, Directive } from "@slicky/core";
@Directive({
    selector: "no-export-directive",
})
class NoExportDirective {
}
@Directive({
    id: "directive-a",
    selector: "test-directive-a",
})
export class TestDirectiveA {
}
@Directive({
    id: "3996154245",
    selector: "test-directive-b"
})
export class TestDirectiveB {
}
@Component({
    name: "no-export-component",
    template: "",
})
class NoExportComponent {
}
@Component({
    id: "component-a",
    name: "test-component-a",
    template: function (template, el, component) {
    }
})
export class TestComponentA {
}
@Component({
    id: "1824089172",
    name: "test-component-b",
    template: () => { }
})
export class TestComponentB {
}
