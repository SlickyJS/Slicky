"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("@slicky/reflection");
var OutputDefinition = (function () {
    function OutputDefinition(name) {
        this.name = name;
    }
    return OutputDefinition;
}());
exports.OutputDefinition = OutputDefinition;
exports.Output = reflection_1.makePropertyDecorator(OutputDefinition);
