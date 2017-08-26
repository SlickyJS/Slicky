"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var EnginePluginManager = (function () {
    function EnginePluginManager() {
        this.plugins = [];
    }
    EnginePluginManager.prototype.register = function (plugin) {
        this.plugins.push(plugin);
    };
    EnginePluginManager.prototype.onBeforeProcessElement = function (element, arg) {
        return this.hook('onBeforeProcessElement', element, arg);
    };
    EnginePluginManager.prototype.onProcessElement = function (element, arg) {
        return this.hook('onProcessElement', element, arg);
    };
    EnginePluginManager.prototype.onProcessTemplate = function (arg) {
        return this.hook('onProcessTemplate', arg);
    };
    EnginePluginManager.prototype.onExpressionVariableHook = function (identifier, arg) {
        return this.hook('onExpressionVariableHook', identifier, arg);
    };
    EnginePluginManager.prototype.hook = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        utils_1.forEach(this.plugins, function (plugin) {
            var result = plugin[name].apply(plugin, args);
            if (utils_1.exists(result)) {
                args[0] = result;
            }
        });
        return args[0];
    };
    return EnginePluginManager;
}());
exports.EnginePluginManager = EnginePluginManager;
