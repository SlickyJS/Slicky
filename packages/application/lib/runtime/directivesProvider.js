"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@slicky/core");
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
    DirectivesProvider.prototype.create = function (hash, el, container) {
        var directiveType = this.directives[hash];
        return container.create(directiveType, [
            {
                service: core_1.ElementRef,
                options: {
                    useFactory: function () { return core_1.ElementRef.getForElement(el); },
                },
            },
        ]);
    };
    return DirectivesProvider;
}());
exports.DirectivesProvider = DirectivesProvider;
