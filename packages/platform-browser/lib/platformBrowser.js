"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@slicky/compiler");
var templates_runtime_1 = require("@slicky/templates-runtime");
var utils_1 = require("@slicky/utils");
var PlatformBrowser = (function () {
    function PlatformBrowser() {
        this.compiler = new compiler_1.Compiler;
    }
    PlatformBrowser.prototype.compileComponentTemplate = function (metadata) {
        return this.createTemplateType(this.compiler.compile(metadata));
    };
    PlatformBrowser.prototype.getTemplateTypeByHash = function (hash) {
        return this.createTemplateType(this.compiler.getTemplateByHash(hash));
    };
    PlatformBrowser.prototype.run = function (application, el) {
        application.run(this, el);
    };
    PlatformBrowser.prototype.createTemplateType = function (code) {
        var templateFactory = utils_1.evalCode(code);
        return templateFactory(templates_runtime_1.Template);
    };
    return PlatformBrowser;
}());
exports.PlatformBrowser = PlatformBrowser;
