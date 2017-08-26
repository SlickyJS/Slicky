"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var templates_1 = require("@slicky/templates");
var utils_1 = require("@slicky/utils");
var TemplateSetupComponent = (function (_super) {
    __extends(TemplateSetupComponent, _super);
    function TemplateSetupComponent(hash) {
        var _this = _super.call(this) || this;
        _this.hash = hash;
        return _this;
    }
    TemplateSetupComponent.prototype.render = function () {
        return ("(function(tmpl) {\n" +
            ("\tvar tmpl = root.getProvider(\"templatesProvider\").createFrom(" + this.hash + ", tmpl);\n") +
            (utils_1.indent(this.renderSetup()) + "\n") +
            "})(tmpl);");
    };
    return TemplateSetupComponent;
}(templates_1.TemplateSetup));
exports.TemplateSetupComponent = TemplateSetupComponent;
var TemplateSetupComponentRender = (function (_super) {
    __extends(TemplateSetupComponentRender, _super);
    function TemplateSetupComponentRender() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TemplateSetupComponentRender.prototype.render = function () {
        return "tmpl.render(parent);";
    };
    return TemplateSetupComponentRender;
}(templates_1.TemplateSetup));
exports.TemplateSetupComponentRender = TemplateSetupComponentRender;
var TemplateSetupDirectiveOutput = (function (_super) {
    __extends(TemplateSetupDirectiveOutput, _super);
    function TemplateSetupDirectiveOutput(output, call) {
        var _this = _super.call(this) || this;
        _this.output = output;
        _this.call = call;
        return _this;
    }
    TemplateSetupDirectiveOutput.prototype.render = function () {
        return ("tmpl.getProvider(\"component\")." + this.output + ".subscribe(function($value) {\n" +
            "\troot.run(function() {\n" +
            ("\t\t" + this.call + ";\n") +
            "\t});\n" +
            "});");
    };
    return TemplateSetupDirectiveOutput;
}(templates_1.TemplateSetup));
exports.TemplateSetupDirectiveOutput = TemplateSetupDirectiveOutput;
var TemplateSetupDirectiveOnInit = (function (_super) {
    __extends(TemplateSetupDirectiveOnInit, _super);
    function TemplateSetupDirectiveOnInit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TemplateSetupDirectiveOnInit.prototype.render = function () {
        return "tmpl.getProvider(\"component\").onInit();";
    };
    return TemplateSetupDirectiveOnInit;
}(templates_1.TemplateSetup));
exports.TemplateSetupDirectiveOnInit = TemplateSetupDirectiveOnInit;
var TemplateSetupDirectiveOnDestroy = (function (_super) {
    __extends(TemplateSetupDirectiveOnDestroy, _super);
    function TemplateSetupDirectiveOnDestroy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TemplateSetupDirectiveOnDestroy.prototype.render = function () {
        return ("tmpl.parent.onDestroy(function() {\n" +
            "\ttmpl.getProvider(\"component\").onDestroy();\n" +
            "});");
    };
    return TemplateSetupDirectiveOnDestroy;
}(templates_1.TemplateSetup));
exports.TemplateSetupDirectiveOnDestroy = TemplateSetupDirectiveOnDestroy;
var TemplateSetupComponentHostElement = (function (_super) {
    __extends(TemplateSetupComponentHostElement, _super);
    function TemplateSetupComponentHostElement(property) {
        var _this = _super.call(this) || this;
        _this.property = property;
        return _this;
    }
    TemplateSetupComponentHostElement.prototype.render = function () {
        return "root.getProvider(\"component\")." + this.property + " = parent;";
    };
    return TemplateSetupComponentHostElement;
}(templates_1.TemplateSetup));
exports.TemplateSetupComponentHostElement = TemplateSetupComponentHostElement;
