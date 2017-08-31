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
var utils_1 = require("@slicky/utils");
function applyReplacements(code, replacements) {
    utils_1.forEach(replacements, function (replacement, name) {
        code = code.replace(new RegExp("{{\\s" + name + "\\s}}", 'g'), replacement);
    });
    return code;
}
var BuilderNodesContainer = (function () {
    function BuilderNodesContainer(nodes, delimiter) {
        if (nodes === void 0) { nodes = []; }
        if (delimiter === void 0) { delimiter = '\n'; }
        this.nodes = nodes;
        this.delimiter = delimiter;
    }
    BuilderNodesContainer.prototype.add = function (node) {
        if (utils_1.isString(node)) {
            node = createCode(node);
        }
        this.nodes.push(node);
    };
    BuilderNodesContainer.prototype.addList = function (nodes) {
        this.nodes = this.nodes.concat(nodes);
    };
    BuilderNodesContainer.prototype.replace = function (container) {
        this.nodes = container.nodes;
    };
    BuilderNodesContainer.prototype.isEmpty = function () {
        return this.nodes.length === 0;
    };
    BuilderNodesContainer.prototype.render = function () {
        return utils_1.map(this.nodes, function (node) { return node.render(); }).join(this.delimiter);
    };
    return BuilderNodesContainer;
}());
exports.BuilderNodesContainer = BuilderNodesContainer;
function createCode(code) {
    return new BuilderCode(code);
}
exports.createCode = createCode;
var BuilderCode = (function () {
    function BuilderCode(code) {
        this.code = code;
    }
    BuilderCode.prototype.render = function () {
        return this.code;
    };
    return BuilderCode;
}());
exports.BuilderCode = BuilderCode;
function createIdentifier(identifier) {
    return new BuilderIdentifier(identifier);
}
exports.createIdentifier = createIdentifier;
var BuilderIdentifier = (function (_super) {
    __extends(BuilderIdentifier, _super);
    function BuilderIdentifier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BuilderIdentifier;
}(BuilderCode));
exports.BuilderIdentifier = BuilderIdentifier;
function createString(str) {
    return new BuilderString(str);
}
exports.createString = createString;
var BuilderString = (function (_super) {
    __extends(BuilderString, _super);
    function BuilderString() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BuilderString.prototype.render = function () {
        return "\"" + _super.prototype.render.call(this) + "\"";
    };
    return BuilderString;
}(BuilderCode));
exports.BuilderString = BuilderString;
function createReturn(node) {
    return new BuilderReturn(node);
}
exports.createReturn = createReturn;
var BuilderReturn = (function () {
    function BuilderReturn(node) {
        this.node = node;
    }
    BuilderReturn.prototype.render = function () {
        return "return " + this.node.render();
    };
    return BuilderReturn;
}());
exports.BuilderReturn = BuilderReturn;
function createFunction(name, args, setup) {
    if (args === void 0) { args = []; }
    if (setup === void 0) { setup = null; }
    var fn = new BuilderFunction(name, args);
    if (utils_1.isFunction(setup)) {
        setup(fn);
    }
    return fn;
}
exports.createFunction = createFunction;
var BuilderFunction = (function () {
    function BuilderFunction(name, args) {
        if (name === void 0) { name = null; }
        if (args === void 0) { args = []; }
        this.body = new BuilderNodesContainer;
        this.name = name;
        this.args = args;
    }
    BuilderFunction.prototype.render = function () {
        var name = this.name === null ? '' : " " + this.name;
        var firstListDelimiter = this.name === null ? ' ' : '\n';
        return ("function" + name + "(" + this.args.join(', ') + ")" + firstListDelimiter +
            "{\n" +
            (utils_1.indent(this.body.render()) + "\n") +
            "}");
    };
    return BuilderFunction;
}());
exports.BuilderFunction = BuilderFunction;
function createClass(name, args, setup) {
    if (args === void 0) { args = []; }
    if (setup === void 0) { setup = null; }
    var cls = new BuilderClass(name, args);
    if (utils_1.isFunction(setup)) {
        setup(cls);
    }
    return cls;
}
exports.createClass = createClass;
var BuilderClass = (function () {
    function BuilderClass(name, args) {
        if (args === void 0) { args = []; }
        this.beforeClass = new BuilderNodesContainer;
        this.afterClass = new BuilderNodesContainer;
        this.body = new BuilderNodesContainer;
        this.methods = new BuilderNodesContainer();
        this.name = name;
        this.args = args;
    }
    BuilderClass.prototype.render = function () {
        var _this = this;
        var r = function (code) {
            return applyReplacements(code, {
                className: _this.name,
            });
        };
        return (r(this.beforeClass.render()) + "\n" +
            ("function " + this.name + "(" + this.args.join(', ') + ")\n") +
            "{\n" +
            (utils_1.indent(r(this.body.render())) + "\n") +
            "}\n" +
            (r(this.methods.render()) + "\n") +
            r(this.afterClass.render()));
    };
    return BuilderClass;
}());
exports.BuilderClass = BuilderClass;
function createMethod(parent, name, args, setup) {
    if (args === void 0) { args = []; }
    if (setup === void 0) { setup = null; }
    var method = new BuilderMethod(parent, name, args);
    if (utils_1.isFunction(setup)) {
        setup(method);
    }
    return method;
}
exports.createMethod = createMethod;
var BuilderMethod = (function () {
    function BuilderMethod(parent, name, args) {
        if (args === void 0) { args = []; }
        this.body = new BuilderNodesContainer;
        this.end = new BuilderNodesContainer;
        this.parent = parent;
        this.name = name;
        this.args = args;
    }
    BuilderMethod.prototype.render = function () {
        return (this.parent.name + ".prototype." + this.name + " = function(" + this.args.join(', ') + ")\n" +
            "{\n" +
            (utils_1.indent(this.body.render()) + "\n") +
            (utils_1.indent(this.end.render()) + "\n") +
            "};");
    };
    return BuilderMethod;
}());
exports.BuilderMethod = BuilderMethod;
function createTemplateMethod(parent, id, setup) {
    if (setup === void 0) { setup = null; }
    var method = new BuilderTemplateMethod(parent, id);
    if (utils_1.isFunction(setup)) {
        setup(method);
    }
    return method;
}
exports.createTemplateMethod = createTemplateMethod;
var BuilderTemplateMethod = (function (_super) {
    __extends(BuilderTemplateMethod, _super);
    function BuilderTemplateMethod(parent, id) {
        var _this = _super.call(this, parent, "template" + id, ['tmpl', 'parent', 'setup']) || this;
        _this.id = id;
        _this.body.add('var root = this;');
        _this.body.add("if (setup) {\n" +
            "\tsetup(tmpl);\n" +
            "}");
        _this.end.add('tmpl.init();');
        _this.end.add('return tmpl;');
        return _this;
    }
    return BuilderTemplateMethod;
}(BuilderMethod));
exports.BuilderTemplateMethod = BuilderTemplateMethod;
function createMethodCall(caller, method, args) {
    if (args === void 0) { args = []; }
    return new BuilderMethodCall(caller, method, args);
}
exports.createMethodCall = createMethodCall;
var BuilderMethodCall = (function () {
    function BuilderMethodCall(caller, method, args) {
        if (args === void 0) { args = []; }
        this.caller = caller;
        this.method = method;
        this.args = new BuilderNodesContainer(args, ', ');
    }
    BuilderMethodCall.prototype.render = function () {
        return this.caller.render() + "." + this.method + "(" + this.args.render() + ")";
    };
    return BuilderMethodCall;
}());
exports.BuilderMethodCall = BuilderMethodCall;
function createVar(name, value) {
    return new BuilderVar(name, value);
}
exports.createVar = createVar;
var BuilderVar = (function () {
    function BuilderVar(name, value) {
        this.name = name;
        this.value = value;
    }
    BuilderVar.prototype.render = function () {
        return "var " + this.name + " = " + this.value.render() + ";";
    };
    return BuilderVar;
}());
exports.BuilderVar = BuilderVar;
function createAddComment(comment, appendMode, setup) {
    if (appendMode === void 0) { appendMode = true; }
    if (setup === void 0) { setup = null; }
    var node = new BuilderAddComment(comment, appendMode);
    if (utils_1.isFunction(setup)) {
        setup(node);
    }
    return node;
}
exports.createAddComment = createAddComment;
var BuilderAddComment = (function () {
    function BuilderAddComment(comment, appendMode) {
        if (appendMode === void 0) { appendMode = true; }
        this.setup = new BuilderNodesContainer;
        this.comment = comment;
        this.appendMode = appendMode;
    }
    BuilderAddComment.prototype.render = function () {
        var _this = this;
        var args = [
            createIdentifier('parent'),
            createString(this.comment),
        ];
        if (!this.setup.isEmpty()) {
            args.push(createFunction(null, ['parent'], function (fn) {
                fn.body.replace(_this.setup);
            }));
        }
        return createMethodCall(createIdentifier('tmpl'), this.appendMode ? '_appendComment' : '_insertCommentBefore', args).render() + ';';
    };
    return BuilderAddComment;
}());
exports.BuilderAddComment = BuilderAddComment;
function createAddText(text, appendMode, setup) {
    if (appendMode === void 0) { appendMode = true; }
    if (setup === void 0) { setup = null; }
    var node = new BuilderAddText(text, appendMode);
    if (utils_1.isFunction(setup)) {
        setup(node);
    }
    return node;
}
exports.createAddText = createAddText;
var BuilderAddText = (function () {
    function BuilderAddText(text, appendMode) {
        if (appendMode === void 0) { appendMode = true; }
        this.setup = new BuilderNodesContainer;
        this.text = text;
        this.appendMode = appendMode;
    }
    BuilderAddText.prototype.render = function () {
        var _this = this;
        var args = [
            createIdentifier('parent'),
            createString(this.text),
        ];
        if (!this.setup.isEmpty()) {
            args.push(createFunction(null, ['text'], function (fn) {
                fn.body.replace(_this.setup);
            }));
        }
        return createMethodCall(createIdentifier('tmpl'), this.appendMode ? '_appendText' : '_insertTextBefore', args).render() + ';';
    };
    return BuilderAddText;
}());
exports.BuilderAddText = BuilderAddText;
function createAddElement(name, appendMode, setup) {
    if (appendMode === void 0) { appendMode = true; }
    if (setup === void 0) { setup = null; }
    var element = new BuilderAddElement(name, appendMode);
    if (utils_1.isFunction(setup)) {
        setup(element);
    }
    return element;
}
exports.createAddElement = createAddElement;
var BuilderAddElement = (function () {
    function BuilderAddElement(name, appendMode) {
        if (appendMode === void 0) { appendMode = true; }
        this.attributes = {};
        this.setup = new BuilderNodesContainer;
        this.name = name;
        this.appendMode = appendMode;
    }
    BuilderAddElement.prototype.setAttribute = function (name, value) {
        this.attributes[name] = value;
    };
    BuilderAddElement.prototype.render = function () {
        var _this = this;
        var attributes = [];
        utils_1.forEach(this.attributes, function (value, name) {
            attributes.push("\"" + name + "\": \"" + value + "\"");
        });
        var args = [
            createIdentifier('parent'),
            createString(this.name),
        ];
        if (!attributes.length && !this.setup.isEmpty()) {
            args.push(createCode('{}'));
        }
        else if (attributes.length) {
            args.push(createCode("{" + attributes.join(', ') + "}"));
        }
        if (!this.setup.isEmpty()) {
            args.push(createFunction(null, ['parent'], function (fn) {
                fn.body.replace(_this.setup);
            }));
        }
        return createMethodCall(createIdentifier('tmpl'), this.appendMode ? '_appendElement' : '_insertElementBefore', args).render() + ';';
    };
    return BuilderAddElement;
}());
exports.BuilderAddElement = BuilderAddElement;
function createElementEventListener(event, callback, preventDefault) {
    if (preventDefault === void 0) { preventDefault = false; }
    return new BuilderElementEventListener(event, callback, preventDefault);
}
exports.createElementEventListener = createElementEventListener;
var BuilderElementEventListener = (function () {
    function BuilderElementEventListener(event, callback, preventDefault) {
        if (preventDefault === void 0) { preventDefault = false; }
        this.event = event;
        this.callback = callback;
        this.preventDefault = preventDefault;
    }
    BuilderElementEventListener.prototype.render = function () {
        var _this = this;
        return createMethodCall(createIdentifier('tmpl'), '_addElementEventListener', [
            createIdentifier('parent'),
            createString(this.event),
            createFunction(null, ['$event'], function (fn) {
                if (_this.preventDefault) {
                    fn.body.add(createCode('$event.preventDefault();'));
                }
                fn.body.add(_this.callback + ';');
            }),
        ]).render() + ';';
    };
    return BuilderElementEventListener;
}());
exports.BuilderElementEventListener = BuilderElementEventListener;
function createWatch(watch, setup) {
    if (setup === void 0) { setup = null; }
    var watcher = new BuilderWatch(watch);
    if (utils_1.isFunction(setup)) {
        setup(watcher);
    }
    return watcher;
}
exports.createWatch = createWatch;
var BuilderWatch = (function () {
    function BuilderWatch(watch, watchParent) {
        if (watchParent === void 0) { watchParent = false; }
        this.update = new BuilderNodesContainer;
        this.watch = watch;
        this.watchParent = watchParent;
    }
    BuilderWatch.prototype.render = function () {
        var _this = this;
        var caller = this.watchParent ? 'tmpl.parent' : 'tmpl';
        return createMethodCall(createMethodCall(createIdentifier(caller), 'getProvider', [createString('watcher')]), 'watch', [
            createFunction(null, [], function (fn) { return fn.body.add(_this.watch + ';'); }),
            createFunction(null, ['value'], function (fn) { return fn.body.replace(_this.update); }),
        ]).render() + ';';
    };
    return BuilderWatch;
}());
exports.BuilderWatch = BuilderWatch;
function createImportTemplate(templateId, factorySetup, setup) {
    if (factorySetup === void 0) { factorySetup = []; }
    if (setup === void 0) { setup = null; }
    var template = new BuilderImportTemplate(templateId, factorySetup);
    if (utils_1.isFunction(setup)) {
        setup(template);
    }
    return template;
}
exports.createImportTemplate = createImportTemplate;
var BuilderImportTemplate = (function () {
    function BuilderImportTemplate(templateId, factorySetup) {
        if (factorySetup === void 0) { factorySetup = []; }
        this.templateId = templateId;
        this.factorySetup = new BuilderNodesContainer(factorySetup);
    }
    BuilderImportTemplate.prototype.render = function () {
        var _this = this;
        return createMethodCall(createIdentifier('root'), "template" + this.templateId, [
            createIdentifier('tmpl'),
            createIdentifier('parent'),
            createFunction(null, ['tmpl'], function (fn) { return fn.body.replace(_this.factorySetup); })
        ]).render();
    };
    return BuilderImportTemplate;
}());
exports.BuilderImportTemplate = BuilderImportTemplate;
function createSetParameter(name, value) {
    return new BuilderSetParameter(name, value);
}
exports.createSetParameter = createSetParameter;
var BuilderSetParameter = (function () {
    function BuilderSetParameter(name, value) {
        this.name = name;
        this.value = value;
    }
    BuilderSetParameter.prototype.render = function () {
        return "tmpl.setParameter(\"" + this.name + "\", " + this.value + ");";
    };
    return BuilderSetParameter;
}());
exports.BuilderSetParameter = BuilderSetParameter;
function createTemplateOnDestroy(callParent, setup) {
    if (callParent === void 0) { callParent = false; }
    if (setup === void 0) { setup = null; }
    var node = new BuilderTemplateOnDestroy(callParent);
    if (utils_1.isFunction(setup)) {
        setup(node);
    }
    return node;
}
exports.createTemplateOnDestroy = createTemplateOnDestroy;
var BuilderTemplateOnDestroy = (function () {
    function BuilderTemplateOnDestroy(callParent) {
        if (callParent === void 0) { callParent = false; }
        this.callback = new BuilderNodesContainer;
        this.callParent = callParent;
    }
    BuilderTemplateOnDestroy.prototype.render = function () {
        var _this = this;
        return createMethodCall(createCode(this.callParent ? 'tmpl.parent' : 'tmpl'), 'onDestroy', [
            createFunction(null, [], function (fn) { return fn.body.replace(_this.callback); }),
        ]).render() + ';';
    };
    return BuilderTemplateOnDestroy;
}());
exports.BuilderTemplateOnDestroy = BuilderTemplateOnDestroy;
function createEmbeddedTemplatesContainer(templateId, setup) {
    if (setup === void 0) { setup = null; }
    var container = new BuilderEmbeddedTemplatesContainer(templateId);
    if (utils_1.isFunction(setup)) {
        setup(container);
    }
    return container;
}
exports.createEmbeddedTemplatesContainer = createEmbeddedTemplatesContainer;
var BuilderEmbeddedTemplatesContainer = (function () {
    function BuilderEmbeddedTemplatesContainer(templateId) {
        this.setup = new BuilderNodesContainer;
        this.templateId = templateId;
    }
    BuilderEmbeddedTemplatesContainer.prototype.render = function () {
        return ("root._createEmbeddedTemplatesContainer(tmpl, parent, function(tmpl, parent, setup) {\n" +
            ("\treturn root.template" + this.templateId + "(tmpl, parent, setup);\n") +
            "}, function(tmpl) {\n" +
            (utils_1.indent(this.setup.render()) + "\n") +
            "\ttmpl.init();\n" +
            "});");
    };
    return BuilderEmbeddedTemplatesContainer;
}());
exports.BuilderEmbeddedTemplatesContainer = BuilderEmbeddedTemplatesContainer;
function createFunctionCall(left, args) {
    if (args === void 0) { args = []; }
    return new BuilderFunctionCall(left, args);
}
exports.createFunctionCall = createFunctionCall;
var BuilderFunctionCall = (function () {
    function BuilderFunctionCall(left, args) {
        if (args === void 0) { args = []; }
        this.left = left;
        this.args = new BuilderNodesContainer(args, ', ');
    }
    BuilderFunctionCall.prototype.render = function () {
        return this.left.render() + "(" + this.args.render() + ");";
    };
    return BuilderFunctionCall;
}());
exports.BuilderFunctionCall = BuilderFunctionCall;
function createIfHelper(templateId, watch) {
    return new BuilderIfHelper(templateId, watch);
}
exports.createIfHelper = createIfHelper;
var BuilderIfHelper = (function () {
    function BuilderIfHelper(templateId, watch) {
        this.templateId = templateId;
        this.watch = watch;
    }
    BuilderIfHelper.prototype.render = function () {
        var _this = this;
        return createEmbeddedTemplatesContainer(this.templateId, function (container) {
            container.setup.add(createFunctionCall(createMethodCall(createIdentifier('tmpl'), 'getProvider', [
                createString('ifHelperFactory'),
            ]), [
                createIdentifier('tmpl'),
                createFunction(null, ['helper'], function (fn) {
                    fn.body.add(createWatch(_this.watch, function (watcher) {
                        watcher.update.add('helper.check(value);');
                    }));
                }),
            ]));
        }).render();
    };
    return BuilderIfHelper;
}());
exports.BuilderIfHelper = BuilderIfHelper;
function createForOfHelper(id, forOf, forItem, forIndex, trackBy) {
    if (forIndex === void 0) { forIndex = null; }
    if (trackBy === void 0) { trackBy = null; }
    return new BuilderForOfHelper(id, forOf, forItem, forIndex, trackBy);
}
exports.createForOfHelper = createForOfHelper;
var BuilderForOfHelper = (function () {
    function BuilderForOfHelper(id, forOf, forItem, forIndex, trackBy) {
        if (forIndex === void 0) { forIndex = null; }
        if (trackBy === void 0) { trackBy = null; }
        this.id = id;
        this.forOf = forOf;
        this.forItem = forItem;
        this.forIndex = forIndex;
        this.trackBy = trackBy;
    }
    BuilderForOfHelper.prototype.render = function () {
        var forItem = "\"" + this.forItem + "\"";
        var forIndex = this.forIndex ? "\"" + this.forIndex + "\"" : 'null';
        var forTrackBy = this.trackBy ? this.trackBy : 'null';
        return ("root._createEmbeddedTemplatesContainer(tmpl, parent, function(tmpl, parent, setup) {\n" +
            ("\treturn root.template" + this.id + "(tmpl, parent, setup);\n") +
            "}, function(tmpl) {\n" +
            ("\ttmpl.getProvider(\"forOfHelperFactory\")(tmpl, " + forItem + ", " + forIndex + ", " + forTrackBy + ", function(helper) {\n") +
            "\t\ttmpl.getProvider(\"watcher\").watch(function() {\n" +
            ("\t\t\t" + this.forOf + ";\n") +
            "\t\t}, function(value) {\n" +
            "\t\t\thelper.check(value);\n" +
            "\t\t});\n" +
            "\t});\n" +
            "\ttmpl.init();\n" +
            "});");
    };
    return BuilderForOfHelper;
}());
exports.BuilderForOfHelper = BuilderForOfHelper;
