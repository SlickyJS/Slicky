"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("@slicky/reflection");
var utils_1 = require("@slicky/utils");
var directive_1 = require("./directive");
var ComponentAnnotationDefinition = (function (_super) {
    __extends(ComponentAnnotationDefinition, _super);
    function ComponentAnnotationDefinition(options) {
        var _this = _super.call(this, options) || this;
        _this.directives = [];
        _this.filters = [];
        _this.template = options.template;
        if (utils_1.exists(options.controllerAs)) {
            _this.controllerAs = options.controllerAs;
        }
        if (utils_1.exists(options.directives)) {
            _this.directives = options.directives;
        }
        if (utils_1.exists(options.filters)) {
            _this.filters = options.filters;
        }
        return _this;
    }
    return ComponentAnnotationDefinition;
}(directive_1.DirectiveAnnotationDefinition));
exports.ComponentAnnotationDefinition = ComponentAnnotationDefinition;
exports.Component = reflection_1.makeClassDecorator(ComponentAnnotationDefinition);
