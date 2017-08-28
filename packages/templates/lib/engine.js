"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var query_selector_1 = require("@slicky/query-selector");
var utils_1 = require("@slicky/utils");
var _ = require("@slicky/html-parser");
var tjs = require("@slicky/tiny-js");
var tokenizer_1 = require("@slicky/tokenizer");
var event_emitter_1 = require("@slicky/event-emitter");
var querySelector_1 = require("./querySelector");
var enginePluginManager_1 = require("./enginePluginManager");
var default_1 = require("./default");
var engineProgress_1 = require("./engineProgress");
var t = require("./builder");
var Engine = (function () {
    function Engine() {
        this.compiled = new event_emitter_1.EventEmitter();
        this.plugins = new enginePluginManager_1.EnginePluginManager;
        this.addPlugin(new default_1.IfEnginePlugin);
        this.addPlugin(new default_1.ForEnginePlugin);
    }
    Engine.prototype.addPlugin = function (plugin) {
        this.plugins.register(plugin);
    };
    Engine.prototype.compile = function (name, template) {
        var progress = new engineProgress_1.EngineProgress;
        var matcher = new query_selector_1.Matcher(new querySelector_1.DocumentWalker);
        var builder = new t.TemplateBuilder(name + '', matcher);
        var tree = (new _.HTMLParser(template)).parse();
        this.processTree(builder, builder.getMainMethod(), progress, matcher, tree);
        var code = builder.render();
        this.compiled.emit({
            name: name,
            code: code,
        });
        return code;
    };
    Engine.prototype.processTree = function (builder, builderParent, progress, matcher, parent, insertBefore) {
        var _this = this;
        if (insertBefore === void 0) { insertBefore = false; }
        utils_1.forEach(parent.childNodes, function (child) {
            if (child instanceof _.ASTHTMLNodeElement) {
                _this.processElement(builder, builderParent, progress, matcher, child, insertBefore);
            }
            else if (child instanceof _.ASTHTMLNodeExpression) {
                _this.processExpression(builderParent, progress, child, insertBefore);
            }
            else if (child instanceof _.ASTHTMLNodeText) {
                _this.processText(builderParent, child, insertBefore);
            }
        });
    };
    Engine.prototype.processExpression = function (parent, progress, expression, insertBefore) {
        var _this = this;
        if (insertBefore === void 0) { insertBefore = false; }
        parent.addText('', insertBefore, function (text) {
            text.addSetupWatch(_this.compileExpression(expression.value, progress, true), 'text.nodeValue = value');
        });
    };
    Engine.prototype.processText = function (parent, text, insertBefore) {
        if (insertBefore === void 0) { insertBefore = false; }
        var value = text.value;
        value = value
            .replace(/[\u000d\u0009\u000a\u0020]/g, '\u0020')
            .replace(/\u0020{2,}/g, '\u0020');
        if (value === '') {
            return;
        }
        parent.addText(value, insertBefore);
    };
    Engine.prototype.processElement = function (builder, parent, progress, matcher, element, insertBefore) {
        var _this = this;
        if (insertBefore === void 0) { insertBefore = false; }
        element = this.plugins.onBeforeProcessElement(element, {
            progress: progress,
            matcher: matcher,
            engine: this,
        });
        if (element.name === 'include') {
            return this.processElementInclude(builder, parent, progress, element, insertBefore);
        }
        if (element.name === 'template') {
            return this.processElementTemplate(builder, parent, progress, matcher, element);
        }
        parent.addElement(element.name, insertBefore, function (el) {
            _this.plugins.onProcessElement(element, {
                element: el,
                progress: progress,
                matcher: matcher,
                engine: _this,
            });
            utils_1.forEach(element.events, function (event) {
                el.addSetupAddEventListener(event.name, _this.compileExpression(event.value, progress), event.preventDefault);
            });
            utils_1.forEach(element.properties, function (property) {
                el.addSetupWatch(_this.compileExpression(property.value, progress, true), "parent." + utils_1.hyphensToCamelCase(property.name) + " = value");
            });
            utils_1.forEach(element.exports, function (exp) {
                if (exp.value !== '' && exp.value !== '$this') {
                    throw Error("Can not export \"" + exp.value + "\" into \"" + exp.name + "\"");
                }
                el.addSetupParameterSet(utils_1.hyphensToCamelCase(exp.name), 'parent');
            });
            utils_1.forEach(element.attributes, function (attribute) {
                if (attribute instanceof _.ASTHTMLNodeExpressionAttribute) {
                    el.setAttribute(attribute.name, '');
                    el.addSetupWatch(_this.compileExpression(attribute.value, progress, true), "parent.setAttribute(\"" + attribute.name + "\", value)");
                }
                else {
                    el.setAttribute(attribute.name, attribute.value);
                }
            });
            _this.processTree(builder, el, progress, matcher, element);
        });
    };
    Engine.prototype.processElementInclude = function (builder, parent, progress, element, insertBefore) {
        var _this = this;
        if (insertBefore === void 0) { insertBefore = false; }
        parent.addComment('slicky-import', insertBefore, function (comment) {
            var selector = '';
            var setParameters = [];
            utils_1.forEach(element.attributes, function (attribute) {
                if (attribute.name === 'selector') {
                    selector = attribute.value;
                }
                else {
                    setParameters.push(attribute);
                }
            });
            var template = builder.findTemplate(selector);
            comment.addSetupImportTemplate(template.id, function (templateImport) {
                utils_1.forEach(setParameters, function (parameter) {
                    templateImport.addSetupParameterSet(utils_1.hyphensToCamelCase(parameter.name), "\"" + parameter.value + "\"");
                });
                utils_1.forEach(element.properties, function (property) {
                    templateImport.addSetupParameterSet(utils_1.hyphensToCamelCase(property.name), _this.compileExpression(property.value, progress));
                });
            });
        });
    };
    Engine.prototype.processElementTemplate = function (builder, parent, progress, matcher, element) {
        var _this = this;
        var injectAttribute = utils_1.find(element.attributes, function (attribute) {
            return attribute.name === 'inject';
        });
        var inject = injectAttribute ? utils_1.map(injectAttribute.value.split(','), function (param) { return param.trim(); }) : [];
        var innerProgress = progress.fork();
        innerProgress.localVariables = utils_1.merge(innerProgress.localVariables, inject);
        innerProgress.inTemplate = true;
        return builder.addTemplate(element, function (template) {
            parent.addComment("slicky-template-" + template.id, false, function (comment) {
                _this.plugins.onProcessTemplate({
                    element: element,
                    template: template,
                    comment: comment,
                    progress: innerProgress,
                    engine: _this,
                });
            });
            _this.processTree(builder, template, innerProgress, matcher, element, true);
        });
    };
    Engine.prototype.compileExpression = function (expr, progress, addMissingReturn) {
        var _this = this;
        if (addMissingReturn === void 0) { addMissingReturn = false; }
        var parser = new tjs.Parser(new tjs.Tokenizer(new tokenizer_1.InputStream(expr)), {
            addMissingReturn: addMissingReturn,
            variableHook: function (identifier, declaration) {
                if (declaration === tjs.ParserVariableDeclaration.FunctionArgument) {
                    return identifier;
                }
                if (identifier.name === '$event') {
                    return identifier;
                }
                if (identifier.name === '$this') {
                    return new tjs.ASTIdentifier('parent');
                }
                var call = new tjs.ASTCallExpression(new tjs.ASTMemberExpression(new tjs.ASTIdentifier('tmpl'), new tjs.ASTIdentifier('getParameter')), [
                    new tjs.ASTStringLiteral(identifier.name),
                ]);
                return _this.plugins.onExpressionVariableHook(call, {
                    declaration: declaration,
                    progress: progress,
                    engine: _this,
                });
            },
            filterExpressionHook: function (filter) {
                return new tjs.ASTCallExpression(new tjs.ASTMemberExpression(new tjs.ASTIdentifier('tmpl'), new tjs.ASTIdentifier('callFilter')), [
                    new tjs.ASTStringLiteral(filter.name.name),
                    filter.modify,
                    new tjs.ASTArrayExpression(filter.arguments),
                ]);
            },
        });
        return parser.parse().render();
    };
    return Engine;
}());
exports.Engine = Engine;
