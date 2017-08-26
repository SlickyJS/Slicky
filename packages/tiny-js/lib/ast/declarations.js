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
var statements_1 = require("./statements");
var ASTDeclaration = (function (_super) {
    __extends(ASTDeclaration, _super);
    function ASTDeclaration() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ASTDeclaration;
}(statements_1.ASTStatement));
exports.ASTDeclaration = ASTDeclaration;
var ASTVariableDeclaration = (function (_super) {
    __extends(ASTVariableDeclaration, _super);
    function ASTVariableDeclaration(name, init) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.init = init;
        return _this;
    }
    ASTVariableDeclaration.prototype.render = function () {
        var init = utils_1.exists(this.init) ? " = " + this.init.render() : '';
        return "var " + this.name.render() + init;
    };
    return ASTVariableDeclaration;
}(ASTDeclaration));
exports.ASTVariableDeclaration = ASTVariableDeclaration;
