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
var watcherProvider_1 = require("../providers/watcherProvider");
var baseTemplate_1 = require("./baseTemplate");
var RenderableTemplate = (function (_super) {
    __extends(RenderableTemplate, _super);
    function RenderableTemplate(application, parent, root) {
        if (parent === void 0) { parent = null; }
        if (root === void 0) { root = null; }
        var _this = _super.call(this, application, parent) || this;
        _this._refreshing = 0;
        _this.nodes = [];
        _this.children = [];
        _this.initialized = false;
        _this.allowRefreshFromParent = true;
        _this.listeners = [];
        _this.root = root;
        _this.addProvider('watcher', new watcherProvider_1.DefaultWatcherProvider);
        return _this;
    }
    RenderableTemplate.prototype.refresh = function () {
        if (!this.initialized) {
            return;
        }
        this._refreshing++;
        this.getProvider('watcher').check();
        utils_1.forEach(this.children, function (child) {
            if (child.allowRefreshFromParent) {
                child.refresh();
            }
        });
        this._refreshing--;
    };
    RenderableTemplate.prototype.init = function () {
        _super.prototype.init.call(this);
        this.initialized = true;
    };
    RenderableTemplate.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        utils_1.forEach(this.listeners, function (listener) {
            listener.element.removeEventListener(listener.name, listener.callback);
        });
        utils_1.forEach(this.nodes, function (node) {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        });
        this.listeners = [];
        this.nodes = [];
        this.getProvider('watcher').disable();
    };
    RenderableTemplate.prototype.getFirstNode = function () {
        return utils_1.exists(this.nodes[0]) ? this.nodes[0] : null;
    };
    RenderableTemplate.prototype._appendComment = function (parent, comment, fn) {
        if (fn === void 0) { fn = null; }
        this.appendChild(parent, parent.ownerDocument.createComment(comment), fn);
    };
    RenderableTemplate.prototype._insertCommentBefore = function (before, comment, fn) {
        if (fn === void 0) { fn = null; }
        this.insertChildBefore(before, before.ownerDocument.createComment(comment), fn);
    };
    RenderableTemplate.prototype._appendText = function (parent, text, fn) {
        if (fn === void 0) { fn = null; }
        this.appendChild(parent, parent.ownerDocument.createTextNode(text), fn);
    };
    RenderableTemplate.prototype._insertTextBefore = function (before, text, fn) {
        if (fn === void 0) { fn = null; }
        this.insertChildBefore(before, before.ownerDocument.createTextNode(text), fn);
    };
    RenderableTemplate.prototype._appendElement = function (parent, elementName, attributes, fn) {
        if (attributes === void 0) { attributes = {}; }
        if (fn === void 0) { fn = null; }
        var node = parent.ownerDocument.createElement(elementName);
        utils_1.forEach(attributes, function (value, name) {
            node.setAttribute(name, value);
        });
        this.appendChild(parent, node, fn);
    };
    RenderableTemplate.prototype._insertElementBefore = function (before, elementName, attributes, fn) {
        if (attributes === void 0) { attributes = {}; }
        if (fn === void 0) { fn = null; }
        var node = before.ownerDocument.createElement(elementName);
        utils_1.forEach(attributes, function (value, name) {
            node.setAttribute(name, value);
        });
        this.insertChildBefore(before, node, fn);
    };
    RenderableTemplate.prototype._addElementEventListener = function (element, eventName, callback) {
        this.listeners.push({
            element: element,
            name: eventName,
            callback: callback,
        });
        this.run(function () {
            element.addEventListener(eventName, callback, false);
        });
    };
    RenderableTemplate.prototype.appendChild = function (parent, child, fn) {
        if (fn === void 0) { fn = null; }
        parent.appendChild(child);
        this.nodes.push(child);
        if (utils_1.isFunction(fn)) {
            fn(child);
        }
    };
    RenderableTemplate.prototype.insertChildBefore = function (before, sibling, fn) {
        if (fn === void 0) { fn = null; }
        before.parentNode.insertBefore(sibling, before);
        this.nodes.push(sibling);
        if (utils_1.isFunction(fn)) {
            fn(sibling);
        }
    };
    return RenderableTemplate;
}(baseTemplate_1.BaseTemplate));
exports.RenderableTemplate = RenderableTemplate;
