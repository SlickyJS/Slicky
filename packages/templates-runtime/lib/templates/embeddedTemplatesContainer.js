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
var embeddedTemplate_1 = require("./embeddedTemplate");
var EmbeddedTemplatesContainer = (function (_super) {
    __extends(EmbeddedTemplatesContainer, _super);
    function EmbeddedTemplatesContainer(application, el, factory, parent, root) {
        if (parent === void 0) { parent = null; }
        if (root === void 0) { root = null; }
        var _this = _super.call(this, application, parent, root) || this;
        _this.children = [];
        _this.el = el;
        _this.factory = factory;
        return _this;
    }
    EmbeddedTemplatesContainer.prototype.add = function (index, setup) {
        if (index === void 0) { index = null; }
        if (setup === void 0) { setup = null; }
        var before = this.el;
        if (index === null) {
            index = this.children.length;
        }
        else if (utils_1.exists(this.children[index])) {
            before = this.children[index].getFirstNode();
        }
        var template = new embeddedTemplate_1.EmbeddedTemplate(this.application, this, this.root);
        if (index !== (this.children.length - 1)) {
            this.children.splice(index, 0, this.children.splice(this.children.length - 1, 1)[0]);
        }
        return this.factory(template, before, setup);
    };
    EmbeddedTemplatesContainer.prototype.remove = function (template) {
        var index = this.children.indexOf(template);
        this.children[index].destroy();
    };
    EmbeddedTemplatesContainer.prototype.move = function (template, index) {
        var previousIndex = this.children.indexOf(template);
        var sibling = this.children[index].getFirstNode();
        utils_1.forEach(template.nodes, function (node) {
            sibling.parentNode.insertBefore(node, sibling);
        });
        this.children.splice(index, 0, this.children.splice(previousIndex, 1)[0]);
    };
    return EmbeddedTemplatesContainer;
}(renderableTemplate_1.RenderableTemplate));
exports.EmbeddedTemplatesContainer = EmbeddedTemplatesContainer;
