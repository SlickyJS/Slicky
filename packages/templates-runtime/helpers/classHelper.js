"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClassHelper = (function () {
    function ClassHelper(el, className) {
        this.el = el;
        this.className = className;
    }
    ClassHelper.prototype.check = function (value) {
        if (value && !this.el.classList.contains(this.className)) {
            this.el.classList.add(this.className);
        }
        else if (!value && this.el.classList.contains(this.className)) {
            this.el.classList.remove(this.className);
        }
    };
    return ClassHelper;
}());
exports.ClassHelper = ClassHelper;
