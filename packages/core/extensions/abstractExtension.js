"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractExtension = (function () {
    function AbstractExtension() {
    }
    AbstractExtension.prototype.getServices = function () {
        return [];
    };
    AbstractExtension.prototype.getFilters = function () {
        return [];
    };
    AbstractExtension.prototype.doUpdateDirectiveMetadata = function (directiveType, metadata, options) {
    };
    AbstractExtension.prototype.doUpdateDirectiveServices = function (directiveType, metadata, services) {
    };
    AbstractExtension.prototype.doInitComponentContainer = function (container, metadata, component) {
    };
    return AbstractExtension;
}());
exports.AbstractExtension = AbstractExtension;
