"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var differ_1 = require("./differ");
var ListDiffer = (function () {
    function ListDiffer(list, trackBy) {
        if (trackBy === void 0) { trackBy = null; }
        this.copy = [];
        if (!utils_1.isFunction(trackBy)) {
            trackBy = function (value, index) { return index; };
        }
        this.trackBy = trackBy;
        this.copy = utils_1.clone(list);
    }
    ListDiffer.prototype.check = function (list) {
        var changes = [];
        var i;
        i = 0;
        while (i < this.copy.length) {
            var previous = this.copy[i];
            var previousTrackBy = this.trackBy(previous, i);
            var current = this.findInItems(list, previousTrackBy);
            if (!current) {
                changes.push({
                    action: differ_1.DifferAction.Remove,
                    previousIndex: i,
                    previousItem: previous,
                    currentIndex: undefined,
                    currentItem: undefined,
                });
                this.copy.splice(i, 1);
            }
            else {
                i++;
            }
        }
        i = 0;
        while (i < list.length) {
            var current = list[i];
            var currentTrackBy = this.trackBy(current, i);
            var previous = this.findInItems(this.copy, currentTrackBy);
            if (!previous) {
                changes.push({
                    action: differ_1.DifferAction.Add,
                    previousIndex: undefined,
                    previousItem: undefined,
                    currentIndex: i,
                    currentItem: current,
                });
                this.copy.splice(i, 0, current);
            }
            else {
                if (current !== previous.item) {
                    changes.push({
                        action: differ_1.DifferAction.Update,
                        previousIndex: previous.index,
                        previousItem: previous.item,
                        currentIndex: i,
                        currentItem: current,
                    });
                    this.copy[i] = current;
                }
                else if (i !== previous.index) {
                    changes.push({
                        action: differ_1.DifferAction.Move,
                        previousIndex: previous.index,
                        previousItem: previous.item,
                        currentIndex: i,
                        currentItem: current,
                    });
                    this.copy.splice(i, 0, this.copy.splice(previous.index, 1)[0]);
                }
                i++;
            }
        }
        return changes;
    };
    ListDiffer.prototype.findInItems = function (items, trackBy) {
        var _this = this;
        var found;
        utils_1.find(items, function (item, index) {
            var itemTrackBy = _this.trackBy(item, index);
            if (itemTrackBy === trackBy) {
                return found = {
                    index: index,
                    item: item,
                };
            }
        });
        return found;
    };
    return ListDiffer;
}());
exports.ListDiffer = ListDiffer;
