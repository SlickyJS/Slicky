"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var EngineProgress = (function () {
    function EngineProgress() {
        this.localVariables = [];
    }
    EngineProgress.prototype.fork = function () {
        var inner = new EngineProgress;
        inner.localVariables = utils_1.clone(this.localVariables);
        return inner;
    };
    return EngineProgress;
}());
exports.EngineProgress = EngineProgress;
