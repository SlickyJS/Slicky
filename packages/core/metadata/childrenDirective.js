"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("@slicky/reflection");
var ChildrenDirectiveDefinition = (function () {
    function ChildrenDirectiveDefinition(directiveType) {
        this.directiveType = directiveType;
    }
    return ChildrenDirectiveDefinition;
}());
exports.ChildrenDirectiveDefinition = ChildrenDirectiveDefinition;
exports.ChildrenDirective = reflection_1.makePropertyDecorator(ChildrenDirectiveDefinition);
