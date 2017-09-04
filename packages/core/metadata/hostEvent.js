"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("@slicky/reflection");
var utils_1 = require("@slicky/utils");
var HostEventDefinition = (function () {
    function HostEventDefinition(selectorOrEvent, event) {
        if (utils_1.exists(event)) {
            this.selector = selectorOrEvent;
            this.event = event;
        }
        else {
            this.event = selectorOrEvent;
        }
    }
    return HostEventDefinition;
}());
exports.HostEventDefinition = HostEventDefinition;
exports.HostEvent = reflection_1.makePropertyDecorator(HostEventDefinition);
