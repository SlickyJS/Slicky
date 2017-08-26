"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("@slicky/reflection");
var utils_1 = require("@slicky/utils");
var DirectiveAnnotationDefinition = (function () {
    function DirectiveAnnotationDefinition(options) {
        this._options = options;
        this.selector = options.selector;
        if (utils_1.exists(options.exportAs)) {
            this.exportAs = options.exportAs;
        }
    }
    return DirectiveAnnotationDefinition;
}());
exports.DirectiveAnnotationDefinition = DirectiveAnnotationDefinition;
exports.Directive = reflection_1.makeClassDecorator(DirectiveAnnotationDefinition);
