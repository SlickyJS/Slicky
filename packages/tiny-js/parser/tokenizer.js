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
var tokenizer_1 = require("@slicky/tokenizer");
var data_1 = require("./data");
var TokenType;
(function (TokenType) {
    TokenType[TokenType["String"] = 0] = "String";
    TokenType[TokenType["Number"] = 1] = "Number";
    TokenType[TokenType["Keyword"] = 2] = "Keyword";
    TokenType[TokenType["Name"] = 3] = "Name";
    TokenType[TokenType["Operator"] = 4] = "Operator";
    TokenType[TokenType["Punctuation"] = 5] = "Punctuation";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
var Tokenizer = (function (_super) {
    __extends(Tokenizer, _super);
    function Tokenizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tokenizer.createFromString = function (input) {
        return new Tokenizer(new tokenizer_1.InputStream(input));
    };
    Tokenizer.prototype.isToken = function (token, type) {
        var value = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            value[_i - 2] = arguments[_i];
        }
        if (!token || token.type !== type) {
            return false;
        }
        if (!value.length) {
            return true;
        }
        return value.indexOf(token.value) >= 0;
    };
    Tokenizer.prototype.isCurrentToken = function (type) {
        var value = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            value[_i - 1] = arguments[_i];
        }
        return this.isToken.apply(this, [this.current(), type].concat(value));
    };
    Tokenizer.prototype.isNextToken = function (type) {
        var value = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            value[_i - 1] = arguments[_i];
        }
        return this.isToken.apply(this, [this.lookahead(), type].concat(value));
    };
    Tokenizer.prototype.isPeek = function (type) {
        var value = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            value[_i - 1] = arguments[_i];
        }
        return this.isToken.apply(this, [this.peek(), type].concat(value));
    };
    Tokenizer.prototype.matchToken = function (type) {
        var value = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            value[_i - 1] = arguments[_i];
        }
        if (!this.isCurrentToken.apply(this, [type].concat(value))) {
            this.expected(TokenType[type] + (value.length ? " (" + value.join('|') + ")" : ''));
        }
        return this.next();
    };
    Tokenizer.prototype.doReadInput = function (input) {
        input.readWhile(isWhitespace);
        var current = input.current();
        if (input.isSequenceFollowing.apply(input, data_1.KEYWORDS)) {
            return {
                type: TokenType.Keyword,
                value: input.matchSequence.apply(input, data_1.KEYWORDS),
            };
        }
        if (input.isSequenceFollowing.apply(input, data_1.PUNCTUATIONS)) {
            return {
                type: TokenType.Punctuation,
                value: input.matchSequence.apply(input, data_1.PUNCTUATIONS),
            };
        }
        if (input.isSequenceFollowing.apply(input, data_1.OPERATORS)) {
            return {
                type: TokenType.Operator,
                value: input.matchSequence.apply(input, data_1.OPERATORS),
            };
        }
        if (isStringStart(current)) {
            return {
                type: TokenType.String,
                value: readString(input),
            };
        }
        if (isDigit(current)) {
            return {
                type: TokenType.Number,
                value: readNumber(input),
            };
        }
        if (isIdentifierStart(current)) {
            return {
                type: TokenType.Name,
                value: readIdentifier(input),
            };
        }
    };
    return Tokenizer;
}(tokenizer_1.AbstractTokenizer));
exports.Tokenizer = Tokenizer;
function isStringStart(ch) {
    return ch === '"' || ch === "'";
}
function isDigit(ch) {
    return /[0-9]/i.test(ch);
}
function isWhitespace(ch) {
    return ch === ' ';
}
function isIdentifierStart(ch) {
    return /[a-z_$]/i.test(ch);
}
function isIdentifier(ch) {
    return isIdentifierStart(ch) || isDigit(ch);
}
function readString(input) {
    return readEscaped(input, input.current());
}
function readIdentifier(input) {
    return input.readWhile(function (ch) { return isIdentifier(ch); });
}
function readNumber(input) {
    var hasDot = false;
    return input.readWhile(function (ch) {
        if (ch === '.') {
            if (hasDot) {
                return false;
            }
            hasDot = true;
            return true;
        }
        return isDigit(ch);
    });
}
function readEscaped(input, end) {
    var escaped = false;
    var str = '';
    input.next();
    while (!input.eof()) {
        var ch = input.next();
        if (escaped) {
            str += ch;
            escaped = false;
        }
        else if (ch === '\\') {
            escaped = true;
        }
        else if (ch === end) {
            break;
        }
        else {
            str += ch;
        }
    }
    return str;
}
