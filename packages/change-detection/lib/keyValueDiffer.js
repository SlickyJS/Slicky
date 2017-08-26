"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var KeyValueChangeAction;
(function (KeyValueChangeAction) {
    KeyValueChangeAction[KeyValueChangeAction["Add"] = 0] = "Add";
    KeyValueChangeAction[KeyValueChangeAction["Update"] = 1] = "Update";
    KeyValueChangeAction[KeyValueChangeAction["Remove"] = 2] = "Remove";
    KeyValueChangeAction[KeyValueChangeAction["Move"] = 3] = "Move";
})(KeyValueChangeAction = exports.KeyValueChangeAction || (exports.KeyValueChangeAction = {}));
var KeyValueDiffer = (function () {
    function KeyValueDiffer(record, trackBy) {
        if (!utils_1.isIterable(record)) {
            throw new Error("KeyValueDiffer: can not watch unsupported type \"" + utils_1.getType(record) + "\".");
        }
        this.trackBy = trackBy ? trackBy : function (value, i) { return i; };
        this.storeCurrentRecord(record);
    }
    KeyValueDiffer.prototype.check = function (record) {
        var changes = this.compare(record);
        if (changes.size) {
            this.storeCurrentRecord(record);
        }
        return changes;
    };
    KeyValueDiffer.prototype.compare = function (record) {
        var _this = this;
        var result = [];
        var moved = [];
        utils_1.forEach(this.properties, function (property) {
            var current = _this.getCurrentProperty(record, property);
            if (current === null) {
                result.push({
                    action: KeyValueChangeAction.Remove,
                    property: property.key,
                    newValue: undefined,
                    oldValue: property.value,
                });
            }
        });
        utils_1.forEach(record, function (value, key) {
            var previous = _this.getPreviousProperty(key, value);
            if (!previous) {
                result.push({
                    action: KeyValueChangeAction.Add,
                    property: key,
                    newValue: value,
                    oldValue: undefined,
                });
            }
            else if (previous.value !== value) {
                result.push({
                    action: KeyValueChangeAction.Update,
                    property: key,
                    newValue: value,
                    oldValue: previous.value,
                });
            }
            else if (previous.key !== key) {
                var movedItem = {
                    action: KeyValueChangeAction.Move,
                    property: key,
                    newValue: key,
                    oldValue: previous.key,
                };
                result.push(movedItem);
                moved.push(movedItem);
            }
        });
        moved.reverse();
        return {
            size: result.length,
            forEachAllActions: function (iterator) {
                utils_1.forEach(result, function (property) {
                    iterator(property);
                });
            },
            forEachAllAdded: function (iterator) {
                utils_1.forEach(result, function (property) {
                    if (property.action === KeyValueChangeAction.Add) {
                        iterator(property);
                    }
                });
            },
            forEachAllUpdated: function (iterator) {
                utils_1.forEach(result, function (property) {
                    if (property.action === KeyValueChangeAction.Update) {
                        iterator(property);
                    }
                });
            },
            forEachAllRemoved: function (iterator) {
                utils_1.forEach(result, function (property) {
                    if (property.action === KeyValueChangeAction.Remove) {
                        iterator(property);
                    }
                });
            },
            forEachAllMoved: function (iterator) {
                utils_1.forEach(moved, function (property) {
                    if (property.action === KeyValueChangeAction.Move) {
                        iterator(property);
                    }
                });
            },
        };
    };
    KeyValueDiffer.prototype.getCurrentProperty = function (record, property) {
        var _this = this;
        var current = null;
        utils_1.find(record, function (value, key) {
            if (_this.trackBy(value, key) === property.trackBy) {
                current = {
                    key: key,
                    value: value,
                };
                return true;
            }
        });
        return current;
    };
    KeyValueDiffer.prototype.getPreviousProperty = function (key, value) {
        var _this = this;
        return utils_1.find(this.properties, function (property) {
            if (property.trackBy === _this.trackBy(value, key)) {
                return true;
            }
        }) || null;
    };
    KeyValueDiffer.prototype.storeCurrentRecord = function (record) {
        var _this = this;
        this.properties = [];
        utils_1.forEach(record, function (value, index) {
            _this.properties.push({
                key: index,
                value: value,
                trackBy: _this.trackBy(value, index),
            });
        });
    };
    return KeyValueDiffer;
}());
exports.KeyValueDiffer = KeyValueDiffer;
