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
var TemplateNodeSetupAware = (function () {
    function TemplateNodeSetupAware() {
        this.setup = [];
    }
    TemplateNodeSetupAware.prototype.addSetup = function (setup, fn) {
        if (fn === void 0) { fn = null; }
        this.setup.push(setup);
        if (utils_1.isFunction(fn)) {
            fn(setup);
        }
    };
    TemplateNodeSetupAware.prototype.addSetupParameterSet = function (name, value) {
        this.setup.push(new TemplateSetupParameterSet(name, value));
    };
    TemplateNodeSetupAware.prototype.addSetupWatch = function (watch, update) {
        this.setup.push(new TemplateSetupWatch(watch, update));
    };
    TemplateNodeSetupAware.prototype.addSetupAddEventListener = function (name, callback, preventDefault) {
        if (preventDefault === void 0) { preventDefault = false; }
        this.setup.push(new TemplateSetupAddEventListener(name, callback, preventDefault));
    };
    TemplateNodeSetupAware.prototype.addSetupIf = function (id, watch) {
        this.setup.push(new TemplateSetupIf(id, watch));
    };
    TemplateNodeSetupAware.prototype.addSetupForOf = function (id, forOf, forItem, forIndex, trackBy) {
        if (forIndex === void 0) { forIndex = null; }
        if (trackBy === void 0) { trackBy = null; }
        this.setup.push(new TemplateSetupForOf(id, forOf, forItem, forIndex, trackBy));
    };
    TemplateNodeSetupAware.prototype.addSetupImportTemplate = function (id, fn) {
        if (fn === void 0) { fn = null; }
        var templateImport = new TemplateSetupImportTemplate(id);
        this.setup.push(templateImport);
        if (utils_1.isFunction(fn)) {
            fn(templateImport);
        }
    };
    TemplateNodeSetupAware.prototype.renderSetup = function () {
        return utils_1.map(this.setup, function (line) { return line.render(); }).join('\n');
    };
    return TemplateNodeSetupAware;
}());
exports.TemplateNodeSetupAware = TemplateNodeSetupAware;
var TemplateSetup = (function (_super) {
    __extends(TemplateSetup, _super);
    function TemplateSetup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TemplateSetup;
}(TemplateNodeSetupAware));
exports.TemplateSetup = TemplateSetup;
var TemplateSetupParameterSet = (function (_super) {
    __extends(TemplateSetupParameterSet, _super);
    function TemplateSetupParameterSet(name, value) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.value = value;
        return _this;
    }
    TemplateSetupParameterSet.prototype.render = function () {
        return "tmpl.setParameter(\"" + this.name + "\", " + this.value + ");";
    };
    return TemplateSetupParameterSet;
}(TemplateSetup));
exports.TemplateSetupParameterSet = TemplateSetupParameterSet;
var TemplateSetupAddEventListener = (function (_super) {
    __extends(TemplateSetupAddEventListener, _super);
    function TemplateSetupAddEventListener(name, callback, preventDefault) {
        if (preventDefault === void 0) { preventDefault = false; }
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.callback = callback;
        _this.preventDefault = preventDefault;
        return _this;
    }
    TemplateSetupAddEventListener.prototype.render = function () {
        var setup = [];
        if (this.preventDefault) {
            setup.push("$event.preventDefault();");
        }
        setup.push(this.callback);
        return ("tmpl._addElementEventListener(parent, \"" + this.name + "\", function($event) {\n" +
            (utils_1.indent(setup.join('\n')) + ";\n") +
            "});");
    };
    return TemplateSetupAddEventListener;
}(TemplateSetup));
exports.TemplateSetupAddEventListener = TemplateSetupAddEventListener;
var TemplateSetupWatch = (function (_super) {
    __extends(TemplateSetupWatch, _super);
    function TemplateSetupWatch(watch, update) {
        var _this = _super.call(this) || this;
        _this.watch = watch;
        _this.update = update;
        return _this;
    }
    TemplateSetupWatch.prototype.render = function () {
        return ("tmpl.getProvider(\"watcher\").watch(\n" +
            "\tfunction() {\n" +
            (utils_1.indent(this.watch, 2) + ";\n") +
            "\t},\n" +
            "\tfunction(value) {\n" +
            (utils_1.indent(this.update, 2) + ";\n") +
            "\t}\n" +
            ");");
    };
    return TemplateSetupWatch;
}(TemplateSetup));
exports.TemplateSetupWatch = TemplateSetupWatch;
var TemplateSetupIf = (function (_super) {
    __extends(TemplateSetupIf, _super);
    function TemplateSetupIf(id, watch) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.watch = watch;
        return _this;
    }
    TemplateSetupIf.prototype.render = function () {
        return ("(function(tmpl) {\n" +
            "\tvar tmpl = root._createEmbeddedTemplatesContainer(tmpl, parent, function(tmpl, parent, setup) {\n" +
            ("\t\treturn root.template" + this.id + "(tmpl, parent, setup);\n") +
            "\t});\n" +
            "\tvar helper = tmpl.getProvider(\"ifHelperFactory\")(tmpl);\n" +
            "\ttmpl.getProvider(\"watcher\").watch(function() {\n" +
            ("\t\t" + this.watch + ";\n") +
            "\t}, function(value) {\n" +
            "\t\thelper.check(value);\n" +
            "\t});\n" +
            "})(tmpl);");
    };
    return TemplateSetupIf;
}(TemplateSetup));
exports.TemplateSetupIf = TemplateSetupIf;
var TemplateSetupForOf = (function (_super) {
    __extends(TemplateSetupForOf, _super);
    function TemplateSetupForOf(id, forOf, forItem, forIndex, trackBy) {
        if (forIndex === void 0) { forIndex = null; }
        if (trackBy === void 0) { trackBy = null; }
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.forOf = forOf;
        _this.forItem = forItem;
        _this.forIndex = forIndex;
        _this.trackBy = trackBy;
        return _this;
    }
    TemplateSetupForOf.prototype.render = function () {
        var argsList = [];
        if (this.forIndex) {
            argsList.push("\"" + this.forIndex + "\"");
        }
        else if (this.trackBy) {
            argsList.push('null');
        }
        if (this.trackBy) {
            argsList.push(this.trackBy);
        }
        var args = argsList.length ? ", " + utils_1.indent(argsList.join(', ')) : '';
        return ("(function(tmpl) {\n" +
            "\tvar tmpl = root._createEmbeddedTemplatesContainer(tmpl, parent, function(tmpl, parent, setup) {\n" +
            ("\t\treturn root.template" + this.id + "(tmpl, parent, setup);\n") +
            "\t});\n" +
            ("\tvar helper = tmpl.getProvider(\"forOfHelperFactory\")(tmpl, \"" + this.forItem + "\"" + args + ");\n") +
            "\ttmpl.getProvider(\"watcher\").watch(function() {\n" +
            ("\t\t" + this.forOf + ";\n") +
            "\t}, function(value) {\n" +
            "\t\thelper.check(value);\n" +
            "\t});\n" +
            "})(tmpl);");
    };
    return TemplateSetupForOf;
}(TemplateSetup));
exports.TemplateSetupForOf = TemplateSetupForOf;
var TemplateSetupImportTemplate = (function (_super) {
    __extends(TemplateSetupImportTemplate, _super);
    function TemplateSetupImportTemplate(id) {
        var _this = _super.call(this) || this;
        _this.id = id;
        return _this;
    }
    TemplateSetupImportTemplate.prototype.render = function () {
        if (!this.setup.length) {
            return "root.template" + this.id + "(tmpl, parent);";
        }
        return ("root.template" + this.id + "(tmpl, parent, function(tmpl) {\n" +
            (utils_1.indent(this.renderSetup()) + "\n") +
            "});");
    };
    return TemplateSetupImportTemplate;
}(TemplateSetup));
exports.TemplateSetupImportTemplate = TemplateSetupImportTemplate;
var TemplateNode = (function (_super) {
    __extends(TemplateNode, _super);
    function TemplateNode(parentNode) {
        if (parentNode === void 0) { parentNode = null; }
        var _this = _super.call(this) || this;
        _this.parentNode = parentNode;
        return _this;
    }
    return TemplateNode;
}(TemplateNodeSetupAware));
exports.TemplateNode = TemplateNode;
var TemplateNodeParent = (function (_super) {
    __extends(TemplateNodeParent, _super);
    function TemplateNodeParent(parentNode) {
        if (parentNode === void 0) { parentNode = null; }
        var _this = _super.call(this, parentNode) || this;
        _this.childNodes = [];
        return _this;
    }
    TemplateNodeParent.prototype.addComment = function (text, insertBefore, fn) {
        if (insertBefore === void 0) { insertBefore = false; }
        if (fn === void 0) { fn = null; }
        var node = new TemplateNodeComment(text, insertBefore);
        this.childNodes.push(node);
        if (utils_1.isFunction(fn)) {
            fn(node);
        }
    };
    TemplateNodeParent.prototype.addText = function (text, insertBefore, fn) {
        if (insertBefore === void 0) { insertBefore = false; }
        if (fn === void 0) { fn = null; }
        var node = new TemplateNodeText(text, insertBefore);
        this.childNodes.push(node);
        if (utils_1.isFunction(fn)) {
            fn(node);
        }
    };
    TemplateNodeParent.prototype.addElement = function (elementName, insertBefore, fn) {
        if (insertBefore === void 0) { insertBefore = false; }
        if (fn === void 0) { fn = null; }
        var node = new TemplateNodeElement(elementName, insertBefore);
        this.childNodes.push(node);
        if (utils_1.isFunction(fn)) {
            fn(node);
        }
    };
    TemplateNodeParent.prototype.renderChildNodes = function () {
        return utils_1.map(this.childNodes, function (node) { return node.render(); }).join('\n');
    };
    return TemplateNodeParent;
}(TemplateNode));
exports.TemplateNodeParent = TemplateNodeParent;
var TemplateMethod = (function (_super) {
    __extends(TemplateMethod, _super);
    function TemplateMethod(className, name) {
        var _this = _super.call(this) || this;
        _this.className = className;
        _this.name = name;
        return _this;
    }
    TemplateMethod.prototype.render = function () {
        return ("Template" + this.className + ".prototype." + this.name + " = function(parent)\n" +
            "{\n" +
            "\tvar root = this;\n" +
            "\tvar tmpl = this;\n" +
            (utils_1.indent(this.renderChildNodes()) + "\n") +
            "};");
    };
    return TemplateMethod;
}(TemplateNodeParent));
exports.TemplateMethod = TemplateMethod;
var TemplateMethodTemplate = (function (_super) {
    __extends(TemplateMethodTemplate, _super);
    function TemplateMethodTemplate(className, name, id) {
        var _this = _super.call(this, className, name) || this;
        _this.id = id;
        return _this;
    }
    TemplateMethodTemplate.prototype.render = function () {
        return ("Template" + this.className + ".prototype." + this.name + " = function(tmpl, parent, setup)\n" +
            "{\n" +
            "\tvar root = this;\n" +
            "\tif (setup) {\n" +
            "\t\tsetup(tmpl);\n" +
            "\t}\n" +
            (utils_1.indent(this.renderChildNodes()) + "\n") +
            "\treturn tmpl;\n" +
            "};");
    };
    return TemplateMethodTemplate;
}(TemplateMethod));
exports.TemplateMethodTemplate = TemplateMethodTemplate;
var TemplateNodeComment = (function (_super) {
    __extends(TemplateNodeComment, _super);
    function TemplateNodeComment(text, insertBefore, parent) {
        if (insertBefore === void 0) { insertBefore = false; }
        if (parent === void 0) { parent = null; }
        var _this = _super.call(this, parent) || this;
        _this.text = text;
        _this.insertBefore = insertBefore;
        return _this;
    }
    TemplateNodeComment.prototype.render = function () {
        var method = this.insertBefore ? '_insertCommentBefore' : '_appendComment';
        if (!this.setup.length) {
            return "tmpl." + method + "(parent, \"" + this.text + "\");";
        }
        return ("tmpl." + method + "(parent, \"" + this.text + "\", function(parent) {\n" +
            (utils_1.indent(this.renderSetup()) + "\n") +
            "});");
    };
    return TemplateNodeComment;
}(TemplateNode));
exports.TemplateNodeComment = TemplateNodeComment;
var TemplateNodeText = (function (_super) {
    __extends(TemplateNodeText, _super);
    function TemplateNodeText(text, insertBefore, parent) {
        if (insertBefore === void 0) { insertBefore = false; }
        if (parent === void 0) { parent = null; }
        var _this = _super.call(this, parent) || this;
        _this.text = text;
        _this.insertBefore = insertBefore;
        return _this;
    }
    TemplateNodeText.prototype.render = function () {
        var method = this.insertBefore ? '_insertTextBefore' : '_appendText';
        if (!this.setup.length) {
            return "tmpl." + method + "(parent, \"" + this.text + "\");";
        }
        return ("tmpl." + method + "(parent, \"" + this.text + "\", function(text) {\n" +
            (utils_1.indent(this.renderSetup()) + "\n") +
            "});");
    };
    return TemplateNodeText;
}(TemplateNode));
exports.TemplateNodeText = TemplateNodeText;
var TemplateNodeElement = (function (_super) {
    __extends(TemplateNodeElement, _super);
    function TemplateNodeElement(name, insertBefore, parentNode) {
        if (insertBefore === void 0) { insertBefore = false; }
        if (parentNode === void 0) { parentNode = null; }
        var _this = _super.call(this, parentNode) || this;
        _this.attributes = {};
        _this.name = name;
        _this.insertBefore = insertBefore;
        return _this;
    }
    TemplateNodeElement.prototype.setAttribute = function (name, value) {
        this.attributes[name] = value;
    };
    TemplateNodeElement.prototype.render = function () {
        var method = this.insertBefore ? '_insertElementBefore' : '_appendElement';
        if (!this.setup.length && !this.childNodes.length) {
            if (!utils_1.keys(this.attributes).length) {
                return "tmpl." + method + "(parent, \"" + this.name + "\");";
            }
            return "tmpl." + method + "(parent, \"" + this.name + "\", " + this.renderAttributes() + ");";
        }
        var setup = [
            this.renderSetup(),
            this.renderChildNodes(),
        ];
        setup = utils_1.filter(setup, function (block) {
            return block !== '';
        });
        return ("tmpl." + method + "(parent, \"" + this.name + "\", " + this.renderAttributes() + ", function(parent) {\n" +
            (utils_1.indent(setup.join('\n')) + "\n") +
            "});");
    };
    TemplateNodeElement.prototype.renderAttributes = function () {
        var attributes = [];
        utils_1.forEach(this.attributes, function (value, name) {
            attributes.push("\"" + name + "\": \"" + value + "\"");
        });
        return "{" + attributes.join(', ') + "}";
    };
    return TemplateNodeElement;
}(TemplateNodeParent));
exports.TemplateNodeElement = TemplateNodeElement;
