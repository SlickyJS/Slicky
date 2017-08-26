"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@slicky/compiler");
var templates_runtime_1 = require("@slicky/templates-runtime");
var utils_1 = require("@slicky/utils");
var BrowserPlatform = (function () {
    function BrowserPlatform() {
        this.compiler = new compiler_1.Compiler;
    }
    BrowserPlatform.prototype.compileComponentTemplate = function (metadata) {
        return this.createTemplateType(this.compiler.compile(metadata));
    };
    BrowserPlatform.prototype.getTemplateTypeByHash = function (hash) {
        return this.createTemplateType(this.compiler.getTemplateByHash(hash));
    };
    BrowserPlatform.prototype.createTemplateType = function (code) {
        var templateFactory = utils_1.evalCode(code);
        return templateFactory(templates_runtime_1.Template);
    };
    return BrowserPlatform;
}());
exports.BrowserPlatform = BrowserPlatform;
