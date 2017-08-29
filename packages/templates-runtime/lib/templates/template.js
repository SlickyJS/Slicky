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
var renderableTemplate_1 = require("./renderableTemplate");
var embeddedTemplatesContainer_1 = require("./embeddedTemplatesContainer");
var Template = (function (_super) {
    __extends(Template, _super);
    function Template(application, parent) {
        return _super.call(this, application, parent) || this;
    }
    Template.childTemplateExtend = function (child) {
        utils_1.extend(child, this);
    };
    Template.prototype.render = function (el) {
        el.innerHTML = '';
        this.main(el);
    };
    Template.prototype._createEmbeddedTemplatesContainer = function (parent, el, factory, setup) {
        if (setup === void 0) { setup = null; }
        var container = new embeddedTemplatesContainer_1.EmbeddedTemplatesContainer(this.application, el, factory, parent, this);
        if (utils_1.isFunction(setup)) {
            setup(container);
        }
        return container;
    };
    return Template;
}(renderableTemplate_1.RenderableTemplate));
exports.Template = Template;
