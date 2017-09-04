"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var ELEMENT_STORAGE = '__slicky_element_ref';
var ElementRef = (function () {
    function ElementRef(nativeElement) {
        this.nativeElement = nativeElement;
    }
    ElementRef.getForElement = function (nativeElement) {
        if (utils_1.exists(nativeElement[ELEMENT_STORAGE])) {
            return nativeElement[ELEMENT_STORAGE];
        }
        return nativeElement[ELEMENT_STORAGE] = new ElementRef(nativeElement);
    };
    return ElementRef;
}());
exports.ElementRef = ElementRef;
