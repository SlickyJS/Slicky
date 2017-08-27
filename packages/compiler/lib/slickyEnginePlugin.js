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
var c = require("@slicky/core");
var tjs = require("@slicky/tiny-js");
var s = require("./nodes");
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
            arg.element.addSetup(new s.TemplateSetupComponentHostElement(hostElement.property));
        });
        utils_1.forEach(this.metadata.directives, function (directive) {
            if (!arg.matcher.matches(element, directive.metadata.selector)) {
                return;
            }
            if (directive.metadata.type === c.DirectiveDefinitionType.Component) {
                _this.compiler.compile(directive.metadata);
            }
            arg.element.addSetup(new s.TemplateSetupDirective(directive.metadata.hash, directive.metadata.type), function (setup) {
                var onTemplateDestroy = [];
                utils_1.forEach(directive.metadata.inputs, function (input) {
                    var property;
                    var isProperty = false;
                    var propertyFinder = function (isProp) {
                        return function (prop) {
                            if (prop.name === input.name) {
                                property = prop;
                                isProperty = isProp;
                                return true;
                            }
                        };
                    };
                    property =
                        utils_1.find(element.properties, propertyFinder(true)) ||
                            utils_1.find(element.attributes, propertyFinder(false));
                    if (!utils_1.exists(property) && input.required) {
                    }
                    if (!utils_1.exists(property)) {
                        return;
                    }
                    if (isProperty) {
                        element.properties.splice(element.properties.indexOf(property), 1);
                        var directiveUpdate = directive.metadata.onUpdate ?
                            "; \ndirective.onUpdate('" + property.name + "', value)" :
                            '';
                        _this.expressionInParent = true;
                        setup.addSetupWatch(arg.engine.compileExpression(property.value, arg.progress, true), "directive." + input.property + " = value" + directiveUpdate);
                        _this.expressionInParent = false;
                    }
                    else {
                        element.attributes.splice(element.attributes.indexOf(property), 1);
                        setup.addSetup(new s.TemplateSetupDirectivePropertyWrite(input.property, "\"" + property.value + "\""));
                        if (directive.metadata.onUpdate) {
                            setup.addSetup(new s.TemplateSetupDirectiveMethodCall('onUpdate', "\"" + input.property + "\", \"" + property.value + "\""));
                        }
                    }
                });
                utils_1.forEach(directive.metadata.outputs, function (output) {
                    var event = utils_1.find(element.events, function (event) {
                        return event.name === output.name;
                    });
                    if (event) {
                        element.events.splice(element.events.indexOf(event), 1);
                    }
                    setup.addSetup(new s.TemplateSetupDirectiveOutput(output.property, arg.engine.compileExpression(event.value, arg.progress)));
                });
                var removeChildDirectives = [];
                utils_1.forEach(_this.metadata.childDirectives, function (childDirective, i) {
                    if (childDirective.directiveType === directive.directiveType && !arg.progress.inTemplate) {
                        setup.addSetup(new s.TemplateSetupDirectivePropertyWrite(childDirective.property, 'directive', true));
                        removeChildDirectives.push(i);
                    }
                });
                utils_1.forEach(removeChildDirectives, function (i) {
                    _this.metadata.childDirectives.splice(i, 1);
                });
                var removeChildrenDirectives = [];
                utils_1.forEach(_this.metadata.childrenDirectives, function (childrenDirectives, i) {
                    if (childrenDirectives.directiveType === directive.directiveType) {
                        setup.addSetup(new s.TemplateSetupDirectiveMethodCall(childrenDirectives.property + ".add.emit", 'directive', true));
                        onTemplateDestroy.push("root.getProvider(\"component\")." + childrenDirectives.property + ".remove.emit(directive);");
                        removeChildrenDirectives.push(i);
                    }
                });
                utils_1.forEach(removeChildrenDirectives, function (i) {
                    _this.metadata.childrenDirectives.splice(i, 1);
                });
                if (directive.metadata.onDestroy) {
                    onTemplateDestroy.push('directive.onDestroy()');
                }
                if (onTemplateDestroy.length) {
                    setup.addSetup(new s.TemplateSetupTemplateOnDestroy(onTemplateDestroy.join('\n')));
                }
                if (directive.metadata.onInit) {
                    setup.addSetup(new s.TemplateSetupDirectiveOnInit);
                }
                if (directive.metadata.type === c.DirectiveDefinitionType.Component) {
                    setup.addSetup(new s.TemplateSetupComponentRender);
                }
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
