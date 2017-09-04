"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("@slicky/reflection");
var HostElementDefinition = (function () {
    function HostElementDefinition(selector) {
        this.selector = selector;
    }
    return HostElementDefinition;
}());
exports.HostElementDefinition = HostElementDefinition;
exports.HostElement = reflection_1.makePropertyDecorator(HostElementDefinition);
