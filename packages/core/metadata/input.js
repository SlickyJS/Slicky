"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("@slicky/reflection");
var InputDefinition = (function () {
    function InputDefinition(name) {
        this.name = name;
    }
    return InputDefinition;
}());
exports.InputDefinition = InputDefinition;
var RequiredInputDefinition = (function () {
    function RequiredInputDefinition() {
    }
    return RequiredInputDefinition;
}());
exports.RequiredInputDefinition = RequiredInputDefinition;
exports.Input = reflection_1.makePropertyDecorator(InputDefinition);
exports.Required = reflection_1.makePropertyDecorator(RequiredInputDefinition);
