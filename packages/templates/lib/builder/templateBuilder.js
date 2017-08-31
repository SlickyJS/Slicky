"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var b = require("./nodes");
var TemplateBuilder = (function () {
    function TemplateBuilder(className, matcher) {
        var _this = this;
        this.templatesCount = 0;
        this.templates = [];
        this.matcher = matcher;
        this.templateClass = b.createClass("Template" + className, ['application', 'parent'], function (cls) {
            cls.beforeClass.add('_super.childTemplateExtend({{ className }});');
            cls.afterClass.add('return {{ className }};');
            cls.body.add('_super.call(this, application, parent);');
            _this.templateMainMethod = b.createMethod(cls, 'main', ['parent'], function (main) {
                main.body.add('var root = this;');
                main.body.add('var tmpl = this;');
                main.end.add('tmpl.init();');
            });
            cls.methods.add(_this.templateMainMethod);
        });
    }
    TemplateBuilder.prototype.getMainMethod = function () {
        return this.templateMainMethod;
    };
    TemplateBuilder.prototype.addTemplate = function (element, setup) {
        if (setup === void 0) { setup = null; }
        var id = this.templatesCount++;
        var template = b.createTemplateMethod(this.templateClass, id, setup);
        this.templateClass.methods.add(template);
        this.templates.push({
            id: id,
            element: element,
            method: template,
        });
    };
    TemplateBuilder.prototype.findTemplate = function (selector) {
        var _this = this;
        var template = utils_1.find(this.templates, function (template) {
            return _this.matcher.matches(template.element, selector);
        });
        return utils_1.exists(template) ? template.method : undefined;
    };
    TemplateBuilder.prototype.render = function () {
        var _this = this;
        return b.createReturn(b.createFunction(null, ['_super'], function (fn) {
            fn.body.add(_this.templateClass);
        })).render();
    };
    return TemplateBuilder;
}());
exports.TemplateBuilder = TemplateBuilder;
