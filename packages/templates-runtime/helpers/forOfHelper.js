"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var change_detection_1 = require("@slicky/change-detection");
var ForOfHelper = (function () {
    function ForOfHelper(container, item, index, trackBy) {
        if (index === void 0) { index = null; }
        if (trackBy === void 0) { trackBy = null; }
        var _this = this;
        this.templates = [];
        this.container = container;
        this.item = item;
        this.index = index;
        this.trackBy = trackBy || (function (item, index) { return index; });
        this.container.onDestroy(function () { return _this.destroy(); });
    }
    ForOfHelper.prototype.destroy = function () {
        utils_1.forEach(this.templates, function (template) {
            template.destroy();
        });
        this.templates = [];
    };
    ForOfHelper.prototype.check = function (items) {
        var _this = this;
        if (utils_1.isFunction(items.toJS)) {
            items = items.toJS();
        }
        if (!utils_1.isArray(items)) {
            throw new Error("ForOfHelper: can process only arrays, \"" + utils_1.getType(items) + "\" given");
        }
        if (!this.differ) {
            this.differ = new change_detection_1.ListDiffer(items, this.trackBy);
            utils_1.forEach(items, function (item, index) {
                _this.addItem(index, item);
            });
            return;
        }
        var changes = this.differ.check(items);
        utils_1.forEach(changes, function (change) {
            switch (change.action) {
                case change_detection_1.DifferAction.Add:
                    _this.addItem(change.currentIndex, change.currentItem);
                    break;
                case change_detection_1.DifferAction.Update:
                    _this.updateItem(change.previousIndex, change.currentItem);
                    break;
                case change_detection_1.DifferAction.Remove:
                    _this.removeItem(change.previousIndex);
                    break;
                case change_detection_1.DifferAction.Move:
                    _this.moveItem(change.previousIndex, change.currentIndex, change.currentItem);
                    break;
            }
        });
    };
    ForOfHelper.prototype.addItem = function (index, item) {
        var _this = this;
        this.templates.splice(index, 0, this.container.add(index, function (template) {
            _this.updateTemplate(template, item, index);
        }));
    };
    ForOfHelper.prototype.updateItem = function (previousIndex, value) {
        if (!utils_1.exists(this.templates[previousIndex])) {
            return;
        }
        this.updateTemplate(this.templates[previousIndex], value, previousIndex);
    };
    ForOfHelper.prototype.removeItem = function (previousIndex) {
        if (!utils_1.exists(this.templates[previousIndex])) {
            return;
        }
        this.container.remove(this.templates[previousIndex]);
        this.templates.splice(previousIndex, 1);
    };
    ForOfHelper.prototype.moveItem = function (previousIndex, index, value) {
        if (!utils_1.exists(this.templates[previousIndex])) {
            return;
        }
        var template = this.templates[previousIndex];
        this.templates.splice(index, 0, this.templates.splice(previousIndex, 1)[0]);
        this.container.move(template, index);
        this.updateTemplate(template, value, index);
    };
    ForOfHelper.prototype.updateTemplate = function (template, value, index) {
        template.setParameter(this.item, value);
        if (this.index) {
            template.setParameter(this.index, index);
        }
        template.reload();
    };
    return ForOfHelper;
}());
exports.ForOfHelper = ForOfHelper;
