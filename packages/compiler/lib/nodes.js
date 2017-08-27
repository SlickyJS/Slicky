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
var core_1 = require("@slicky/core");
var TemplateSetupDirective = (function (_super) {
    __extends(TemplateSetupDirective, _super);
    function TemplateSetupDirective(hash, type) {
        var _this = _super.call(this) || this;
        _this.hash = hash;
        _this.type = type;
        return _this;
    }
    TemplateSetupDirective.prototype.render = function () {
        var init = this.type === core_1.DirectiveDefinitionType.Directive ?
            "var directive = root.getProvider(\"directivesProvider\").create(" + this.hash + ", parent, root.getProvider(\"container\"));" :
            ("var tmpl = root.getProvider(\"templatesProvider\").createFrom(" + this.hash + ", parent, tmpl);\n" +
                "var directive = tmpl.getProvider(\"component\");");
        return ("(function(tmpl) {\n" +
            (utils_1.indent(init) + "\n") +
            (utils_1.indent(this.renderSetup()) + "\n") +
            "})(tmpl);");
    };
    return TemplateSetupDirective;
}(templates_1.TemplateSetup));
exports.TemplateSetupDirective = TemplateSetupDirective;
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
        return ("directive." + this.output + ".subscribe(function($value) {\n" +
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
        return "directive.onInit();";
    };
    return TemplateSetupDirectiveOnInit;
}(templates_1.TemplateSetup));
exports.TemplateSetupDirectiveOnInit = TemplateSetupDirectiveOnInit;
var TemplateSetupTemplateOnDestroy = (function (_super) {
    __extends(TemplateSetupTemplateOnDestroy, _super);
    function TemplateSetupTemplateOnDestroy(code, callParent) {
        if (callParent === void 0) { callParent = false; }
        var _this = _super.call(this) || this;
        _this.code = code;
        _this.callParent = callParent;
        return _this;
    }
    TemplateSetupTemplateOnDestroy.prototype.render = function () {
        var callee = this.callParent ? '.parent' : '';
        return ("tmpl" + callee + ".onDestroy(function() {\n" +
            (utils_1.indent(this.code) + "\n") +
            "});");
    };
    return TemplateSetupTemplateOnDestroy;
}(templates_1.TemplateSetup));
exports.TemplateSetupTemplateOnDestroy = TemplateSetupTemplateOnDestroy;
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
var TemplateSetupDirectivePropertyWrite = (function (_super) {
    __extends(TemplateSetupDirectivePropertyWrite, _super);
    function TemplateSetupDirectivePropertyWrite(property, value, rootComponent) {
        if (rootComponent === void 0) { rootComponent = false; }
        var _this = _super.call(this) || this;
        _this.property = property;
        _this.value = value;
        _this.rootComponent = rootComponent;
        return _this;
    }
    TemplateSetupDirectivePropertyWrite.prototype.render = function () {
        var target = this.rootComponent ? 'root.getProvider("component")' : 'directive';
        return target + "." + this.property + " = " + this.value + ";";
    };
    return TemplateSetupDirectivePropertyWrite;
}(templates_1.TemplateSetup));
exports.TemplateSetupDirectivePropertyWrite = TemplateSetupDirectivePropertyWrite;
var TemplateSetupDirectiveMethodCall = (function (_super) {
    __extends(TemplateSetupDirectiveMethodCall, _super);
    function TemplateSetupDirectiveMethodCall(method, args, rootComponent) {
        if (rootComponent === void 0) { rootComponent = false; }
        var _this = _super.call(this) || this;
        _this.method = method;
        _this.args = args;
        _this.rootComponent = rootComponent;
        return _this;
    }
    TemplateSetupDirectiveMethodCall.prototype.render = function () {
        var target = this.rootComponent ? 'root.getProvider("component")' : 'directive';
        return target + "." + this.method + "(" + this.args + ");";
    };
    return TemplateSetupDirectiveMethodCall;
}(templates_1.TemplateSetup));
exports.TemplateSetupDirectiveMethodCall = TemplateSetupDirectiveMethodCall;
