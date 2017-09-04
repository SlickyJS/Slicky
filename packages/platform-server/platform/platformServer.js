"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformServer = (function () {
    function PlatformServer(templatesFactory) {
        this.templatesFactory = templatesFactory;
    }
    PlatformServer.prototype.compileComponentTemplate = function (metadata) {
        return this.getTemplateTypeByHash(metadata.hash);
    };
    PlatformServer.prototype.getTemplateTypeByHash = function (hash) {
        return this.templatesFactory(hash);
    };
    PlatformServer.prototype.run = function (application, el) {
        application.run(this, el);
    };
    return PlatformServer;
}());
exports.PlatformServer = PlatformServer;
