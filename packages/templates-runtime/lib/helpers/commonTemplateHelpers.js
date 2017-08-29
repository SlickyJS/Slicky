"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var ifHelper_1 = require("./ifHelper");
var forOfHelper_1 = require("./forOfHelper");
var CommonTemplateHelpers = (function () {
    function CommonTemplateHelpers() {
    }
    CommonTemplateHelpers.install = function (template) {
        template.addProvider('ifHelperFactory', function (container, setup) {
            if (setup === void 0) { setup = null; }
            var helper = new ifHelper_1.IfHelper(container);
            if (utils_1.isFunction(setup)) {
                setup(helper);
            }
            return helper;
        });
        template.addProvider('forOfHelperFactory', function (container, item, index, trackBy, setup) {
            if (index === void 0) { index = null; }
            if (trackBy === void 0) { trackBy = null; }
            if (setup === void 0) { setup = null; }
            var helper = new forOfHelper_1.ForOfHelper(container, item, index, trackBy);
            if (utils_1.isFunction(setup)) {
                setup(helper);
            }
            return helper;
        });
    };
    return CommonTemplateHelpers;
}());
exports.CommonTemplateHelpers = CommonTemplateHelpers;
