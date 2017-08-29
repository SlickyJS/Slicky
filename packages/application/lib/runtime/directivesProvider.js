"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@slicky/core");
var utils_1 = require("@slicky/utils");
var DirectivesProvider = (function () {
    function DirectivesProvider(metadataLoader) {
        var _this = this;
        this.directives = {};
        metadataLoader.loaded.subscribe(function (directive) {
            _this.directives[directive.metadata.hash] = directive;
        });
    }
    DirectivesProvider.prototype.getDirectiveTypeByHash = function (hash) {
        return this.directives[hash].directiveType;
    };
    DirectivesProvider.prototype.getDirectiveMetadataByHash = function (hash) {
        return this.directives[hash].metadata;
    };
    DirectivesProvider.prototype.create = function (hash, el, container, setup) {
        if (setup === void 0) { setup = null; }
        var directiveType = this.directives[hash].directiveType;
        var directive = container.create(directiveType, [
            {
                service: core_1.ElementRef,
                options: {
                    useFactory: function () { return core_1.ElementRef.getForElement(el); },
                },
            },
        ]);
        if (utils_1.isFunction(setup)) {
            setup(directive);
        }
        return directive;
    };
    return DirectivesProvider;
}());
exports.DirectivesProvider = DirectivesProvider;
