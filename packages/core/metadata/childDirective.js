"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("@slicky/reflection");
var ChildDirectiveDefinition = (function () {
    function ChildDirectiveDefinition(directiveType) {
        this.directiveType = directiveType;
    }
    return ChildDirectiveDefinition;
}());
exports.ChildDirectiveDefinition = ChildDirectiveDefinition;
exports.ChildDirective = reflection_1.makePropertyDecorator(ChildDirectiveDefinition);
