"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SimpleDiffer = (function () {
    function SimpleDiffer(record) {
        this.refresh(record);
    }
    SimpleDiffer.prototype.check = function (record) {
        if (record !== this.record) {
            var change = {
                newValue: record,
                oldValue: this.record,
            };
            this.refresh(record);
            return change;
        }
    };
    SimpleDiffer.prototype.refresh = function (record) {
        this.record = record;
    };
    return SimpleDiffer;
}());
exports.SimpleDiffer = SimpleDiffer;
