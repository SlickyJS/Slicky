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
var enginePlugin_1 = require("../engine/enginePlugin");
var b = require("../builder");
var IfEnginePlugin = (function (_super) {
    __extends(IfEnginePlugin, _super);
    function IfEnginePlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IfEnginePlugin.prototype.onProcessTemplate = function (arg) {
        var condition = utils_1.find(arg.element.properties, function (property) {
            return property.name === 's:if';
        });
        if (!condition) {
            return;
        }
        arg.comment.setup.add(b.createIfHelper(arg.template.id, arg.engine.compileExpression(condition.value, arg.progress, true)));
    };
    return IfEnginePlugin;
}(enginePlugin_1.EnginePlugin));
exports.IfEnginePlugin = IfEnginePlugin;
