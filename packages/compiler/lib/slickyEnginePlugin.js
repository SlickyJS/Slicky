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
var tjs = require("@slicky/tiny-js");
var nodes_1 = require("./nodes");
var SlickyEnginePlugin = (function (_super) {
    __extends(SlickyEnginePlugin, _super);
    function SlickyEnginePlugin(compiler, metadata) {
        var _this = _super.call(this) || this;
        _this.expressionInParent = false;
        _this.compiler = compiler;
        _this.metadata = metadata;
        return _this;
    }
    SlickyEnginePlugin.prototype.onProcessElement = function (element, arg) {
        var _this = this;
        utils_1.forEach(this.metadata.elements, function (hostElement) {
            if (!arg.matcher.matches(element, hostElement.selector)) {
                return;
            }
            arg.element.addSetup(new nodes_1.TemplateSetupComponentHostElement(hostElement.property));
        });
        utils_1.forEach(this.metadata.directives, function (directive) {
            if (!arg.matcher.matches(element, directive.metadata.selector)) {
                return;
            }
            _this.compiler.compile(directive.metadata);
            arg.element.addSetup(new nodes_1.TemplateSetupComponent(directive.metadata.hash), function (setup) {
                utils_1.forEach(directive.metadata.inputs, function (input) {
                    var property = utils_1.find(element.properties, function (property) {
                        return property.name === input.name;
                    });
                    if (property) {
                        element.properties.splice(element.properties.indexOf(property), 1);
                    }
                    else if (input.required) {
                    }
                    _this.expressionInParent = true;
                    setup.addSetupWatch(arg.engine.compileExpression(property.value, arg.progress, true), "tmpl.getProvider(\"component\")." + input.property + " = value");
                    _this.expressionInParent = false;
                });
                utils_1.forEach(directive.metadata.outputs, function (output) {
                    var event = utils_1.find(element.events, function (event) {
                        return event.name === output.name;
                    });
                    if (event) {
                        element.events.splice(element.events.indexOf(event), 1);
                    }
                    setup.addSetup(new nodes_1.TemplateSetupDirectiveOutput(output.property, arg.engine.compileExpression(event.value, arg.progress)));
                });
                if (directive.metadata.onDestroy) {
                    setup.addSetup(new nodes_1.TemplateSetupDirectiveOnDestroy);
                }
                if (directive.metadata.onInit) {
                    setup.addSetup(new nodes_1.TemplateSetupDirectiveOnInit);
                }
                setup.addSetup(new nodes_1.TemplateSetupComponentRender);
            });
        });
        return element;
    };
    SlickyEnginePlugin.prototype.onExpressionVariableHook = function (identifier, arg) {
        var parameter = identifier.arguments[0].value;
        if (parameter === '$value') {
            return new tjs.ASTIdentifier(parameter);
        }
        if (arg.progress.localVariables.indexOf(parameter) >= 0) {
            if (this.expressionInParent) {
                return new tjs.ASTCallExpression(new tjs.ASTMemberExpression(new tjs.ASTMemberExpression(new tjs.ASTIdentifier('tmpl'), new tjs.ASTIdentifier('parent')), new tjs.ASTIdentifier('getParameter')), [
                    new tjs.ASTStringLiteral(parameter),
                ]);
            }
            return identifier;
        }
        return new tjs.ASTMemberExpression(new tjs.ASTCallExpression(new tjs.ASTMemberExpression(new tjs.ASTIdentifier('root'), new tjs.ASTIdentifier('getProvider')), [
            new tjs.ASTStringLiteral('component'),
        ]), new tjs.ASTIdentifier(parameter));
    };
    return SlickyEnginePlugin;
}(templates_1.EnginePlugin));
exports.SlickyEnginePlugin = SlickyEnginePlugin;
