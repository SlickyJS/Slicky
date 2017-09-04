"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IfHelper = (function () {
    function IfHelper(container) {
        var _this = this;
        this.container = container;
        this.container.onDestroy(function () { return _this.destroy(); });
    }
    IfHelper.prototype.destroy = function () {
        if (this.current) {
            this.current.destroy();
        }
    };
    IfHelper.prototype.check = function (value) {
        if (value && !this.current) {
            this.current = this.container.add();
        }
        else if (!value && this.current) {
            this.container.remove(this.current);
            this.current = null;
        }
    };
    return IfHelper;
}());
exports.IfHelper = IfHelper;
