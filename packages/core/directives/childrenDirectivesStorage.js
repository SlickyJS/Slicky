"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_emitter_1 = require("@slicky/event-emitter");
var ChildrenDirectivesStorage = (function () {
    function ChildrenDirectivesStorage() {
        this.add = new event_emitter_1.EventEmitter();
        this.remove = new event_emitter_1.EventEmitter();
    }
    return ChildrenDirectivesStorage;
}());
exports.ChildrenDirectivesStorage = ChildrenDirectivesStorage;
