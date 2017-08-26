"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var IterableChangeAction;
(function (IterableChangeAction) {
    IterableChangeAction[IterableChangeAction["Add"] = 0] = "Add";
    IterableChangeAction[IterableChangeAction["Remove"] = 1] = "Remove";
})(IterableChangeAction = exports.IterableChangeAction || (exports.IterableChangeAction = {}));
var IterableDiffer = (function () {
    function IterableDiffer(record) {
        this.refresh(record);
    }
    IterableDiffer.prototype.check = function (record) {
        var changes = this.compare(record);
        if (changes) {
            this.refresh(record);
        }
        return changes;
    };
    IterableDiffer.prototype.compare = function (record) {
        var _this = this;
        var result = [];
        utils_1.forEach(this.record, function (previous) {
            if (!utils_1.exists(utils_1.find(record, function (current) { return previous === current; }))) {
                result.push({
                    action: IterableChangeAction.Remove,
                    value: previous,
                });
            }
        });
        utils_1.forEach(record, function (current) {
            if (!utils_1.exists(utils_1.find(_this.record, function (previous) { return current === previous; }))) {
                result.push({
                    action: IterableChangeAction.Add,
                    value: current,
                });
            }
        });
        if (!result.length) {
            return;
        }
        return {
            forEachAllActions: function (iterator) {
                utils_1.forEach(result, function (property) {
                    iterator(property);
                });
            },
            forEachAllAdded: function (iterator) {
                utils_1.forEach(result, function (property) {
                    if (property.action === IterableChangeAction.Add) {
                        iterator(property);
                    }
                });
            },
            forEachAllRemoved: function (iterator) {
                utils_1.forEach(result, function (property) {
                    if (property.action === IterableChangeAction.Remove) {
                        iterator(property);
                    }
                });
            },
        };
    };
    IterableDiffer.prototype.refresh = function (record) {
        this.record = utils_1.clone(record);
    };
    return IterableDiffer;
}());
exports.IterableDiffer = IterableDiffer;
