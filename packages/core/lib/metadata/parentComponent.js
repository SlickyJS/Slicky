"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("@slicky/reflection");
var ParentComponentDefinition = (function () {
    function ParentComponentDefinition() {
    }
    return ParentComponentDefinition;
}());
exports.ParentComponentDefinition = ParentComponentDefinition;
exports.ParentComponent = reflection_1.makePropertyDecorator(ParentComponentDefinition);
