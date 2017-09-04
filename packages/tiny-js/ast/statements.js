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
var utils_1 = require("@slicky/utils");
var nodes_1 = require("./nodes");
var ASTStatement = (function (_super) {
    __extends(ASTStatement, _super);
    function ASTStatement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ASTStatement;
}(nodes_1.ASTNode));
exports.ASTStatement = ASTStatement;
var ASTBlockStatement = (function (_super) {
    __extends(ASTBlockStatement, _super);
    function ASTBlockStatement(body) {
        var _this = _super.call(this) || this;
        _this.body = body;
        return _this;
    }
    ASTBlockStatement.prototype.render = function () {
        var statements = utils_1.map(this.body, function (statement) { return statement.render(); }).join('; ');
        return "(" + statements + ")";
    };
    return ASTBlockStatement;
}(ASTStatement));
exports.ASTBlockStatement = ASTBlockStatement;
var ASTReturnStatement = (function (_super) {
    __extends(ASTReturnStatement, _super);
    function ASTReturnStatement(argument) {
        var _this = _super.call(this) || this;
        _this.argument = argument;
        return _this;
    }
    ASTReturnStatement.prototype.render = function () {
        var argument = utils_1.exists(this.argument) ? " " + this.argument.render() : '';
        return "return" + argument;
    };
    return ASTReturnStatement;
}(ASTStatement));
exports.ASTReturnStatement = ASTReturnStatement;
var ASTVoidStatement = (function (_super) {
    __extends(ASTVoidStatement, _super);
    function ASTVoidStatement(argument) {
        var _this = _super.call(this) || this;
        _this.argument = argument;
        return _this;
    }
    ASTVoidStatement.prototype.render = function () {
        var argument = utils_1.exists(this.argument) ? " " + this.argument.render() : '';
        return "void" + argument;
    };
    return ASTVoidStatement;
}(ASTStatement));
exports.ASTVoidStatement = ASTVoidStatement;
var ASTThrowStatement = (function (_super) {
    __extends(ASTThrowStatement, _super);
    function ASTThrowStatement(argument) {
        var _this = _super.call(this) || this;
        _this.argument = argument;
        return _this;
    }
    ASTThrowStatement.prototype.render = function () {
        return "throw " + this.argument.render();
    };
    return ASTThrowStatement;
}(ASTStatement));
exports.ASTThrowStatement = ASTThrowStatement;
var ASTDebuggerStatement = (function (_super) {
    __extends(ASTDebuggerStatement, _super);
    function ASTDebuggerStatement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ASTDebuggerStatement.prototype.render = function () {
        return 'debugger';
    };
    return ASTDebuggerStatement;
}(ASTStatement));
exports.ASTDebuggerStatement = ASTDebuggerStatement;
