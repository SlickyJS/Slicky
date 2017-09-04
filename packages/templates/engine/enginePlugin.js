"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EnginePlugin = (function () {
    function EnginePlugin() {
    }
    EnginePlugin.prototype.onBeforeProcessElement = function (element, arg) {
        return element;
    };
    EnginePlugin.prototype.onProcessElement = function (element, arg) {
    };
    EnginePlugin.prototype.onProcessTemplate = function (arg) {
    };
    EnginePlugin.prototype.onExpressionVariableHook = function (identifier, arg) {
        return identifier;
    };
    return EnginePlugin;
}());
exports.EnginePlugin = EnginePlugin;
