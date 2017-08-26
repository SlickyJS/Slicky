"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("@slicky/reflection");
var FilterDefinition = (function () {
    function FilterDefinition(options) {
        this.name = options.name;
    }
    return FilterDefinition;
}());
exports.FilterDefinition = FilterDefinition;
exports.Filter = reflection_1.makeClassDecorator(FilterDefinition);
