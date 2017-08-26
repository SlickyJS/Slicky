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
var tokenizer_1 = require("@slicky/tokenizer");
var TextToken = (function () {
    function TextToken(value) {
        this.value = value;
    }
    return TextToken;
}());
exports.TextToken = TextToken;
var TextTokenText = (function (_super) {
    __extends(TextTokenText, _super);
    function TextTokenText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TextTokenText;
}(TextToken));
exports.TextTokenText = TextTokenText;
var TextTokenExpression = (function (_super) {
    __extends(TextTokenExpression, _super);
    function TextTokenExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TextTokenExpression;
}(TextToken));
exports.TextTokenExpression = TextTokenExpression;
var TextTokenizer = (function (_super) {
    __extends(TextTokenizer, _super);
    function TextTokenizer(input, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, input) || this;
        _this.expressionOpeningTag = TextTokenizer.DEFAULT_EXPRESSION_OPENING_TAG;
        _this.expressionClosingTag = TextTokenizer.DEFAULT_EXPRESSION_CLOSING_TAG;
        if (utils_1.exists(options.expressionOpeningTag)) {
            _this.expressionOpeningTag = options.expressionOpeningTag;
        }
        if (utils_1.exists(options.expressionClosingTag)) {
            _this.expressionClosingTag = options.expressionClosingTag;
        }
        return _this;
    }
    TextTokenizer.prototype.doReadInput = function (input) {
        var _this = this;
        if (input.isSequenceFollowing(this.expressionOpeningTag)) {
            input.matchSequence(this.expressionOpeningTag);
            var expression = input.readWhile(function () { return !input.isSequenceFollowing(_this.expressionClosingTag); });
            input.matchSequence(this.expressionClosingTag);
            return new TextTokenExpression(expression.trim());
        }
        return new TextTokenText(input.readWhile(function () { return !input.isSequenceFollowing(_this.expressionOpeningTag); }));
    };
    TextTokenizer.DEFAULT_EXPRESSION_OPENING_TAG = '{{';
    TextTokenizer.DEFAULT_EXPRESSION_CLOSING_TAG = '}}';
    return TextTokenizer;
}(tokenizer_1.AbstractTokenizer));
exports.TextTokenizer = TextTokenizer;
