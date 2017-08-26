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
var statements_1 = require("./statements");
var ASTExpression = (function (_super) {
    __extends(ASTExpression, _super);
    function ASTExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ASTExpression;
}(nodes_1.ASTNode));
exports.ASTExpression = ASTExpression;
var ASTIdentifier = (function (_super) {
    __extends(ASTIdentifier, _super);
    function ASTIdentifier(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        return _this;
    }
    ASTIdentifier.prototype.render = function () {
        return this.name;
    };
    return ASTIdentifier;
}(ASTExpression));
exports.ASTIdentifier = ASTIdentifier;
var ASTArrowFunctionExpression = (function (_super) {
    __extends(ASTArrowFunctionExpression, _super);
    function ASTArrowFunctionExpression(args, body) {
        var _this = _super.call(this) || this;
        _this.arguments = args;
        _this.body = body;
        return _this;
    }
    ASTArrowFunctionExpression.prototype.render = function () {
        var args = utils_1.map(this.arguments, function (argument) { return argument.render(); }).join(', ');
        var body = this.body instanceof statements_1.ASTReturnStatement ? this.body.render() : utils_1.map(this.body, function (statement) { return statement.render(); }).join('; ');
        return "function(" + args + ") {" + body + "}";
    };
    return ASTArrowFunctionExpression;
}(ASTExpression));
exports.ASTArrowFunctionExpression = ASTArrowFunctionExpression;
var ASTArrayExpression = (function (_super) {
    __extends(ASTArrayExpression, _super);
    function ASTArrayExpression(elements) {
        var _this = _super.call(this) || this;
        _this.elements = elements;
        return _this;
    }
    ASTArrayExpression.prototype.render = function () {
        var elements = utils_1.map(this.elements, function (element) { return element.render(); }).join(', ');
        return "[" + elements + "]";
    };
    return ASTArrayExpression;
}(ASTExpression));
exports.ASTArrayExpression = ASTArrayExpression;
var ASTObjectExpression = (function (_super) {
    __extends(ASTObjectExpression, _super);
    function ASTObjectExpression(members) {
        var _this = _super.call(this) || this;
        _this.members = members;
        return _this;
    }
    ASTObjectExpression.prototype.render = function () {
        var members = utils_1.map(this.members, function (member) { return member.render(); }).join(', ');
        return "{" + members + "}";
    };
    return ASTObjectExpression;
}(ASTExpression));
exports.ASTObjectExpression = ASTObjectExpression;
var ASTObjectMember = (function (_super) {
    __extends(ASTObjectMember, _super);
    function ASTObjectMember(key, value) {
        var _this = _super.call(this) || this;
        _this.key = key;
        _this.value = value;
        return _this;
    }
    ASTObjectMember.prototype.render = function () {
        return this.key.render() + ": " + this.value.render();
    };
    return ASTObjectMember;
}(nodes_1.ASTNode));
exports.ASTObjectMember = ASTObjectMember;
var ASTUnaryExpression = (function (_super) {
    __extends(ASTUnaryExpression, _super);
    function ASTUnaryExpression(operator, argument) {
        var _this = _super.call(this) || this;
        _this.operator = operator;
        _this.argument = argument;
        return _this;
    }
    ASTUnaryExpression.prototype.render = function () {
        return "" + this.operator + this.argument.render();
    };
    return ASTUnaryExpression;
}(ASTExpression));
exports.ASTUnaryExpression = ASTUnaryExpression;
var ASTUpdateExpression = (function (_super) {
    __extends(ASTUpdateExpression, _super);
    function ASTUpdateExpression(operator, argument) {
        var _this = _super.call(this) || this;
        _this.operator = operator;
        _this.argument = argument;
        return _this;
    }
    ASTUpdateExpression.prototype.render = function () {
        return "" + this.argument.render() + this.operator;
    };
    return ASTUpdateExpression;
}(ASTExpression));
exports.ASTUpdateExpression = ASTUpdateExpression;
var ASTBinaryExpression = (function (_super) {
    __extends(ASTBinaryExpression, _super);
    function ASTBinaryExpression(operator, left, right) {
        var _this = _super.call(this) || this;
        _this.operator = operator;
        _this.left = left;
        _this.right = right;
        return _this;
    }
    ASTBinaryExpression.prototype.render = function () {
        return this.left.render() + " " + this.operator + " " + this.right.render();
    };
    return ASTBinaryExpression;
}(ASTExpression));
exports.ASTBinaryExpression = ASTBinaryExpression;
var ASTAssignmentExpression = (function (_super) {
    __extends(ASTAssignmentExpression, _super);
    function ASTAssignmentExpression(operator, left, right) {
        var _this = _super.call(this) || this;
        _this.operator = operator;
        _this.left = left;
        _this.right = right;
        return _this;
    }
    ASTAssignmentExpression.prototype.render = function () {
        return this.left.render() + " " + this.operator + " " + this.right.render();
    };
    return ASTAssignmentExpression;
}(ASTExpression));
exports.ASTAssignmentExpression = ASTAssignmentExpression;
var ASTLogicalExpression = (function (_super) {
    __extends(ASTLogicalExpression, _super);
    function ASTLogicalExpression(operator, left, right) {
        var _this = _super.call(this) || this;
        _this.operator = operator;
        _this.left = left;
        _this.right = right;
        return _this;
    }
    ASTLogicalExpression.prototype.render = function () {
        return this.left.render() + " " + this.operator + " " + this.right.render();
    };
    return ASTLogicalExpression;
}(ASTExpression));
exports.ASTLogicalExpression = ASTLogicalExpression;
var ASTMemberExpression = (function (_super) {
    __extends(ASTMemberExpression, _super);
    function ASTMemberExpression(object, property) {
        var _this = _super.call(this) || this;
        _this.object = object;
        _this.property = property;
        return _this;
    }
    ASTMemberExpression.prototype.render = function () {
        var property = this.property instanceof ASTIdentifier ? "." + this.property.render() : this.property.render();
        return "" + this.object.render() + property;
    };
    return ASTMemberExpression;
}(ASTExpression));
exports.ASTMemberExpression = ASTMemberExpression;
var ASTConditionalExpression = (function (_super) {
    __extends(ASTConditionalExpression, _super);
    function ASTConditionalExpression(test, alternate, consequent) {
        var _this = _super.call(this) || this;
        _this.test = test;
        _this.alternate = alternate;
        _this.consequent = consequent;
        return _this;
    }
    ASTConditionalExpression.prototype.render = function () {
        return this.test.render() + " ? " + this.alternate.render() + " : " + this.consequent.render();
    };
    return ASTConditionalExpression;
}(ASTExpression));
exports.ASTConditionalExpression = ASTConditionalExpression;
var ASTCallExpression = (function (_super) {
    __extends(ASTCallExpression, _super);
    function ASTCallExpression(callee, args) {
        var _this = _super.call(this) || this;
        _this.callee = callee;
        _this.arguments = args;
        return _this;
    }
    ASTCallExpression.prototype.render = function () {
        var args = utils_1.map(this.arguments, function (argument) { return argument.render(); }).join(', ');
        return this.callee.render() + "(" + args + ")";
    };
    return ASTCallExpression;
}(ASTExpression));
exports.ASTCallExpression = ASTCallExpression;
var ASTNewExpression = (function (_super) {
    __extends(ASTNewExpression, _super);
    function ASTNewExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ASTNewExpression.prototype.render = function () {
        return "new " + _super.prototype.render.call(this);
    };
    return ASTNewExpression;
}(ASTCallExpression));
exports.ASTNewExpression = ASTNewExpression;
var ASTFilterExpression = (function (_super) {
    __extends(ASTFilterExpression, _super);
    function ASTFilterExpression(name, modify, args) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.modify = modify;
        _this.arguments = args;
        return _this;
    }
    ASTFilterExpression.prototype.render = function () {
        var args = this.arguments.length ? ", " + utils_1.map(this.arguments, function (argument) { return argument.render(); }).join(', ') : '';
        return this.name.render() + "(" + this.modify.render() + args + ")";
    };
    return ASTFilterExpression;
}(ASTExpression));
exports.ASTFilterExpression = ASTFilterExpression;
