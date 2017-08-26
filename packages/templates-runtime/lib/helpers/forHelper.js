"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var change_detection_1 = require("@slicky/change-detection");
var ForHelper = (function () {
    function ForHelper(container, item, index, trackBy) {
        if (index === void 0) { index = null; }
        if (trackBy === void 0) { trackBy = null; }
        var _this = this;
        this.templates = {};
        this.container = container;
        this.item = item;
        this.index = index;
        this.trackBy = trackBy || (function (item, index) { return index; });
        this.container.onDestroy(function () { return _this.destroy(); });
    }
    ForHelper.prototype.destroy = function () {
        utils_1.forEach(this.templates, function (template) {
            template.destroy();
        });
        this.templates = {};
    };
    ForHelper.prototype.check = function (items) {
        var _this = this;
        if (utils_1.isFunction(items.toJS)) {
            items = items.toJS();
        }
        if (utils_1.isArrayLike(items)) {
            items = utils_1.toArray(items);
        }
        this.items = items;
        if (!this.differ) {
            this.differ = (new change_detection_1.DifferFactory).create(this.items, this.trackBy);
            utils_1.forEach(this.items, function (item, index) {
                _this.addItem(index, item);
            });
            return;
        }
        var changes = this.differ.check(this.items);
        utils_1.forEach(changes, function (change) {
            console.log(change);
            switch (change.action) {
                case change_detection_1.DifferAction.Add:
                    _this.addItem(change.index, change.item);
                    break;
                case change_detection_1.DifferAction.Update:
                    _this.updateItem(change.index, change.item);
                    break;
                case change_detection_1.DifferAction.Remove:
                    _this.removeItem(change.index);
                    break;
                case change_detection_1.DifferAction.Move:
                    _this.moveItem(change.previousIndex, change.index);
                    break;
            }
        });
    };
    ForHelper.prototype.addItem = function (key, value) {
        var _this = this;
        var index = utils_1.isArray(this.items) ? key : undefined;
        this.templates[key] = this.container.add(function (template) {
            _this.updateTemplate(template, value, key);
        }, index);
    };
    ForHelper.prototype.updateItem = function (key, value) {
        if (!utils_1.exists(this.templates[key])) {
            return;
        }
        var template = this.templates[key];
        this.updateTemplate(template, value, key);
    };
    ForHelper.prototype.removeItem = function (key) {
        if (!utils_1.exists(this.templates[key])) {
            return;
        }
        var template = this.templates[key];
        this.container.remove(template);
        delete this.templates[key];
    };
    ForHelper.prototype.moveItem = function (previousKey, key) {
    };
    ForHelper.prototype.updateTemplate = function (template, value, index) {
        template.setParameter(this.item, value);
        if (this.index) {
            template.setParameter(this.index, index);
        }
        template.reload();
    };
    return ForHelper;
}());
exports.ForHelper = ForHelper;
