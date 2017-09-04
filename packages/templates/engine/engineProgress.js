"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var EngineProgress = (function () {
    function EngineProgress() {
        this.localVariables = [];
        this.inTemplate = false;
    }
    EngineProgress.prototype.fork = function () {
        var inner = new EngineProgress;
        inner.localVariables = utils_1.clone(this.localVariables);
        inner.inTemplate = this.inTemplate;
        return inner;
    };
    return EngineProgress;
}());
exports.EngineProgress = EngineProgress;
