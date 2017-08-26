"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var listDiffer_1 = require("./listDiffer");
var DifferFactory = (function () {
    function DifferFactory() {
    }
    DifferFactory.prototype.create = function (data, trackBy) {
        if (trackBy === void 0) { trackBy = null; }
        if (utils_1.isArray(data)) {
            return new listDiffer_1.ListDiffer(data, trackBy);
        }
        throw new Error("DifferFactory: can not create differ for \"" + utils_1.getType(data) + "\"");
    };
    return DifferFactory;
}());
exports.DifferFactory = DifferFactory;
