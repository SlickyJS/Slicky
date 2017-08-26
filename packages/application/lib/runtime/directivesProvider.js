"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DirectivesProvider = (function () {
    function DirectivesProvider(metadataLoader) {
        var _this = this;
        this.directives = {};
        metadataLoader.loaded.subscribe(function (directive) {
            _this.directives[directive.metadata.hash] = directive.directiveType;
        });
    }
    DirectivesProvider.prototype.getDirectiveTypeByHash = function (hash) {
        return this.directives[hash];
    };
    return DirectivesProvider;
}());
exports.DirectivesProvider = DirectivesProvider;
