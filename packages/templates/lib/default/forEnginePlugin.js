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
var enginePlugin_1 = require("../enginePlugin");
var b = require("../builder");
var ForEnginePlugin = (function (_super) {
    __extends(ForEnginePlugin, _super);
    function ForEnginePlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ForEnginePlugin.prototype.onProcessTemplate = function (arg) {
        var loop = utils_1.find(arg.element.properties, function (property) {
            return property.name === 's:for';
        });
        if (!loop) {
            return;
        }
        var trackBy = utils_1.find(arg.element.properties, function (property) {
            return property.name === 's:for-track-by';
        });
        var forLoop = this.parseFor(loop.value);
        arg.progress.localVariables.push(forLoop.forItem);
        if (forLoop.forIndex) {
            arg.progress.localVariables.push(forLoop.forIndex);
        }
        arg.comment.setup.add(b.createForOfHelper(arg.template.id, arg.engine.compileExpression(forLoop.forOf, arg.progress, true), forLoop.forItem, forLoop.forIndex, trackBy ? arg.engine.compileExpression(trackBy.value, arg.progress) : null));
    };
    ForEnginePlugin.prototype.parseFor = function (loop) {
        var parts = utils_1.map(loop.split('of'), function (part) { return part.trim(); });
        var exports = utils_1.map(parts[0].split(','), function (exp) { return exp.trim(); });
        return {
            forOf: parts[1],
            forItem: exports[0],
            forIndex: utils_1.exists(exports[1]) ? exports[1] : null,
        };
    };
    return ForEnginePlugin;
}(enginePlugin_1.EnginePlugin));
exports.ForEnginePlugin = ForEnginePlugin;
