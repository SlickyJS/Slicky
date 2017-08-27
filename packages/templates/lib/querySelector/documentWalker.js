"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var _ = require("@slicky/html-parser");
var DocumentWalker = (function () {
    function DocumentWalker() {
    }
    DocumentWalker.prototype.getNodeName = function (node) {
        return node.name;
    };
    DocumentWalker.prototype.isElement = function (node) {
        return node instanceof _.ASTHTMLNodeElement;
    };
    DocumentWalker.prototype.isString = function (node) {
        return node instanceof _.ASTHTMLNodeText;
    };
    DocumentWalker.prototype.getParentNode = function (node) {
        return node.parentNode;
    };
    DocumentWalker.prototype.getChildNodes = function (parent) {
        return parent.childNodes;
    };
    DocumentWalker.prototype.getAttribute = function (node, name) {
        var finder = function (attribute) { return attribute.name === name; };
        var attr = utils_1.find(node.attributes, finder) ||
            utils_1.find(node.properties, finder);
        return utils_1.exists(attr) ? attr.value : undefined;
    };
    return DocumentWalker;
}());
exports.DocumentWalker = DocumentWalker;
