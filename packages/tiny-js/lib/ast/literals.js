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
var expressions_1 = require("./expressions");
var ASTLiteral = (function (_super) {
    __extends(ASTLiteral, _super);
    function ASTLiteral() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ASTLiteral;
}(expressions_1.ASTExpression));
exports.ASTLiteral = ASTLiteral;
var ASTRegExpLiteral = (function (_super) {
    __extends(ASTRegExpLiteral, _super);
    function ASTRegExpLiteral(pattern, flags) {
        var _this = _super.call(this) || this;
        _this.pattern = pattern;
        _this.flags = flags;
        return _this;
    }
    ASTRegExpLiteral.prototype.render = function () {
        return "/" + this.pattern + "/" + this.flags;
    };
    return ASTRegExpLiteral;
}(ASTLiteral));
exports.ASTRegExpLiteral = ASTRegExpLiteral;
var ASTNullLiteral = (function (_super) {
    __extends(ASTNullLiteral, _super);
    function ASTNullLiteral() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ASTNullLiteral.prototype.render = function () {
        return 'null';
    };
    return ASTNullLiteral;
}(ASTLiteral));
exports.ASTNullLiteral = ASTNullLiteral;
var ASTStringLiteral = (function (_super) {
    __extends(ASTStringLiteral, _super);
    function ASTStringLiteral(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    ASTStringLiteral.prototype.render = function () {
        return "'" + this.value + "'";
    };
    return ASTStringLiteral;
}(ASTLiteral));
exports.ASTStringLiteral = ASTStringLiteral;
var ASTBooleanLiteral = (function (_super) {
    __extends(ASTBooleanLiteral, _super);
    function ASTBooleanLiteral(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    ASTBooleanLiteral.prototype.render = function () {
        return this.value === true ? 'true' : 'false';
    };
    return ASTBooleanLiteral;
}(ASTLiteral));
exports.ASTBooleanLiteral = ASTBooleanLiteral;
var ASTNumericLiteral = (function (_super) {
    __extends(ASTNumericLiteral, _super);
    function ASTNumericLiteral(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    ASTNumericLiteral.prototype.render = function () {
        return this.value + '';
    };
    return ASTNumericLiteral;
}(ASTLiteral));
exports.ASTNumericLiteral = ASTNumericLiteral;
