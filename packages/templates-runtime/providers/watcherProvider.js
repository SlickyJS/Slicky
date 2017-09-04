"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var DefaultWatcherProvider = (function () {
    function DefaultWatcherProvider() {
        this.watchers = [];
        this.enabled = true;
    }
    DefaultWatcherProvider.prototype.disable = function () {
        this.enabled = false;
    };
    DefaultWatcherProvider.prototype.check = function () {
        if (!this.enabled) {
            return false;
        }
        var changed = false;
        utils_1.forEach(this.watchers, function (watcher) {
            var current = watcher.getter();
            if (current !== watcher.current) {
                watcher.update(current);
                watcher.current = current;
                changed = true;
            }
        });
        return changed;
    };
    DefaultWatcherProvider.prototype.watch = function (getter, update) {
        if (!this.enabled) {
            return;
        }
        var current = getter();
        update(current);
        this.watchers.push({
            current: current,
            getter: getter,
            update: update,
        });
    };
    return DefaultWatcherProvider;
}());
exports.DefaultWatcherProvider = DefaultWatcherProvider;
