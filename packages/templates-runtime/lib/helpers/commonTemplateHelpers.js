"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ifHelper_1 = require("./ifHelper");
var forOfHelper_1 = require("./forOfHelper");
var CommonTemplateHelpers = (function () {
    function CommonTemplateHelpers() {
    }
    CommonTemplateHelpers.install = function (template) {
        template.addProvider('ifHelperFactory', function (container) {
            return new ifHelper_1.IfHelper(container);
        });
        template.addProvider('forOfHelperFactory', function (container, item, index, trackBy) {
            if (index === void 0) { index = null; }
            if (trackBy === void 0) { trackBy = null; }
            return new forOfHelper_1.ForOfHelper(container, item, index, trackBy);
        });
    };
    return CommonTemplateHelpers;
}());
exports.CommonTemplateHelpers = CommonTemplateHelpers;
