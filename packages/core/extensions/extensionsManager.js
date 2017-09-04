"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var ExtensionsManager = (function () {
    function ExtensionsManager() {
        this.extensions = [];
    }
    ExtensionsManager.prototype.addExtension = function (extension) {
        this.extensions.push(extension);
    };
    ExtensionsManager.prototype.getServices = function () {
        var services = [];
        utils_1.forEach(this.extensions, function (extension) {
            services = utils_1.merge(services, extension.getServices());
        });
        return services;
    };
    ExtensionsManager.prototype.getFilters = function () {
        var filters = [];
        utils_1.forEach(this.extensions, function (extension) {
            filters = utils_1.merge(filters, extension.getFilters());
        });
        return filters;
    };
    ExtensionsManager.prototype.doUpdateDirectiveMetadata = function (directiveType, metadata, options) {
        this.callHook('doUpdateDirectiveMetadata', directiveType, metadata, options);
    };
    ExtensionsManager.prototype.doUpdateDirectiveServices = function (directiveType, metadata, services) {
        this.callHook('doUpdateDirectiveServices', directiveType, metadata, services);
    };
    ExtensionsManager.prototype.doInitComponentContainer = function (container, metadata, component) {
        this.callHook('doInitComponentContainer', container, metadata, component);
    };
    ExtensionsManager.prototype.callHook = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        utils_1.forEach(this.extensions, function (extension) {
            extension[name].apply(extension, args);
        });
    };
    return ExtensionsManager;
}());
exports.ExtensionsManager = ExtensionsManager;
