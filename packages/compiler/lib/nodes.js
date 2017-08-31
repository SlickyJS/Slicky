"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var b = require("@slicky/templates");
var core_1 = require("@slicky/core");
var utils_1 = require("@slicky/utils");
function createComponentSetHostElement(property) {
    return new BuilderComponentSetHostElement(property);
}
exports.createComponentSetHostElement = createComponentSetHostElement;
var BuilderComponentSetHostElement = (function () {
    function BuilderComponentSetHostElement(property) {
        this.property = property;
    }
    BuilderComponentSetHostElement.prototype.render = function () {
        return "root.getProvider(\"component\")." + this.property + " = parent;";
    };
    return BuilderComponentSetHostElement;
}());
exports.BuilderComponentSetHostElement = BuilderComponentSetHostElement;
function createCreateDirective(hash, type, setup) {
    if (setup === void 0) { setup = null; }
    var node = new BuilderCreateDirective(hash, type);
    if (utils_1.isFunction(setup)) {
        setup(node);
    }
    return node;
}
exports.createCreateDirective = createCreateDirective;
var BuilderCreateDirective = (function () {
    function BuilderCreateDirective(hash, type) {
        this.setup = new b.BuilderNodesContainer;
        this.hash = hash;
        this.type = type;
    }
    BuilderCreateDirective.prototype.render = function () {
        var init = this.type === core_1.DirectiveDefinitionType.Directive ?
            "root.getProvider(\"directivesProvider\").create(" + this.hash + ", parent, root.getProvider(\"container\"), function(directive) {" :
            "root.getProvider(\"templatesProvider\").createFrom(" + this.hash + ", parent, tmpl, function(tmpl, directive) {";
        return (init + "\n" +
            (utils_1.indent(this.setup.render()) + "\n") +
            "});");
    };
    return BuilderCreateDirective;
}());
exports.BuilderCreateDirective = BuilderCreateDirective;
function createDirectivePropertyWrite(property, value, rootComponent) {
    if (rootComponent === void 0) { rootComponent = false; }
    return new BuilderDirectivePropertyWrite(property, value, rootComponent);
}
exports.createDirectivePropertyWrite = createDirectivePropertyWrite;
var BuilderDirectivePropertyWrite = (function () {
    function BuilderDirectivePropertyWrite(property, value, rootComponent) {
        if (rootComponent === void 0) { rootComponent = false; }
        this.property = property;
        this.value = value;
        this.rootComponent = rootComponent;
    }
    BuilderDirectivePropertyWrite.prototype.render = function () {
        var target = this.rootComponent ? 'root.getProvider("component")' : 'directive';
        return target + "." + this.property + " = " + this.value + ";";
    };
    return BuilderDirectivePropertyWrite;
}());
exports.BuilderDirectivePropertyWrite = BuilderDirectivePropertyWrite;
function createDirectiveMethodCall(method, args, rootComponent) {
    if (args === void 0) { args = []; }
    if (rootComponent === void 0) { rootComponent = false; }
    return new BuilderDirectiveMethodCall(method, args, rootComponent);
}
exports.createDirectiveMethodCall = createDirectiveMethodCall;
var BuilderDirectiveMethodCall = (function () {
    function BuilderDirectiveMethodCall(method, args, rootComponent) {
        if (args === void 0) { args = []; }
        if (rootComponent === void 0) { rootComponent = false; }
        this.method = method;
        this.args = args;
        this.rootComponent = rootComponent;
    }
    BuilderDirectiveMethodCall.prototype.render = function () {
        var target = this.rootComponent ? 'root.getProvider("component")' : 'directive';
        return target + "." + this.method + "(" + this.args.join(', ') + ");";
    };
    return BuilderDirectiveMethodCall;
}());
exports.BuilderDirectiveMethodCall = BuilderDirectiveMethodCall;
function createDirectiveOutput(output, call) {
    return new BuilderDirectiveOutput(output, call);
}
exports.createDirectiveOutput = createDirectiveOutput;
var BuilderDirectiveOutput = (function () {
    function BuilderDirectiveOutput(output, call) {
        this.output = output;
        this.call = call;
    }
    BuilderDirectiveOutput.prototype.render = function () {
        return ("directive." + this.output + ".subscribe(function($value) {\n" +
            "\troot.run(function() {\n" +
            ("\t\t" + this.call + ";\n") +
            "\t});\n" +
            "});");
    };
    return BuilderDirectiveOutput;
}());
exports.BuilderDirectiveOutput = BuilderDirectiveOutput;
function createDirectiveOnInit() {
    return new BuilderDirectiveOnInit;
}
exports.createDirectiveOnInit = createDirectiveOnInit;
var BuilderDirectiveOnInit = (function () {
    function BuilderDirectiveOnInit() {
    }
    BuilderDirectiveOnInit.prototype.render = function () {
        return b.createMethodCall(b.createIdentifier('tmpl'), 'run', [
            b.createFunction(null, [], function (fn) {
                fn.body.add('directive.onInit();');
            }),
        ]).render() + ';';
    };
    return BuilderDirectiveOnInit;
}());
exports.BuilderDirectiveOnInit = BuilderDirectiveOnInit;
function createComponentRender() {
    return new BuilderComponentRender;
}
exports.createComponentRender = createComponentRender;
var BuilderComponentRender = (function () {
    function BuilderComponentRender() {
    }
    BuilderComponentRender.prototype.render = function () {
        return 'tmpl.render(parent);';
    };
    return BuilderComponentRender;
}());
exports.BuilderComponentRender = BuilderComponentRender;
