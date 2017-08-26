"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var ElementRef = (function () {
    function ElementRef(nativeElement) {
        this.nativeElement = nativeElement;
        this.document = nativeElement.ownerDocument;
    }
    ElementRef.prototype.addElement = function (elementName, attributes, fn) {
        if (attributes === void 0) { attributes = {}; }
        if (fn === void 0) { fn = null; }
        var node = this.document.createElement(elementName);
        utils_1.forEach(attributes, function (value, name) {
            node.setAttribute(name, value);
        });
        this.nativeElement.appendChild(node);
        if (utils_1.isFunction(fn)) {
            fn(new ElementRef(node));
        }
    };
    ElementRef.prototype.addText = function (text, fn) {
        if (fn === void 0) { fn = null; }
        var node = this.document.createTextNode(text);
        this.nativeElement.appendChild(node);
        if (utils_1.isFunction(fn)) {
            fn(node);
        }
    };
    return ElementRef;
}());
exports.ElementRef = ElementRef;
