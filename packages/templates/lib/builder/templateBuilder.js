"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var t = require("./nodes");
var TemplateBuilder = (function () {
    function TemplateBuilder(className, matcher) {
        this.templatesCount = 0;
        this.templates = [];
        this.methods = {};
        this.className = className;
        this.matcher = matcher;
        this.methods['main'] = new t.TemplateMethod(this.className, 'main');
    }
    TemplateBuilder.prototype.getMainMethod = function () {
        return this.methods['main'];
    };
    TemplateBuilder.prototype.addTemplate = function (element, fn) {
        if (fn === void 0) { fn = null; }
        var id = this.templatesCount++;
        var name = "template" + id;
        var template = new t.TemplateMethodTemplate(this.className, name, id);
        if (utils_1.isFunction(fn)) {
            fn(template);
        }
        this.templates.push({
            id: id,
            element: element,
            method: template,
        });
        this.methods[name] = template;
    };
    TemplateBuilder.prototype.findTemplate = function (selector) {
        var _this = this;
        var template = utils_1.find(this.templates, function (template) {
            return _this.matcher.matches(template.element, selector);
        });
        return utils_1.exists(template) ? template.method : undefined;
    };
    TemplateBuilder.prototype.render = function () {
        return ("return function(_super)\n" +
            "{\n" +
            ("\t_super.childTemplateExtend(Template" + this.className + ");\n") +
            ("\tfunction Template" + this.className + "(application, parent)\n") +
            "\t{\n" +
            "\t\t_super.call(this, application, parent);\n" +
            "\t}\n" +
            (utils_1.indent(this.renderMethods()) + "\n") +
            ("\treturn Template" + this.className + ";\n") +
            "}");
    };
    TemplateBuilder.prototype.renderMethods = function () {
        var methods = [];
        utils_1.forEach(this.methods, function (method) {
            methods.push(method.render());
        });
        return methods.join('\n');
    };
    return TemplateBuilder;
}());
exports.TemplateBuilder = TemplateBuilder;
