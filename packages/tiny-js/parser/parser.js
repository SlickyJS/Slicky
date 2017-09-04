"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tokenizer_1 = require("@slicky/tokenizer");
var utils_1 = require("@slicky/utils");
var tokenizer_2 = require("./tokenizer");
var data_1 = require("./data");
var _ = require("../ast");
var ParserVariableDeclaration;
(function (ParserVariableDeclaration) {
    ParserVariableDeclaration[ParserVariableDeclaration["Global"] = 0] = "Global";
    ParserVariableDeclaration[ParserVariableDeclaration["Local"] = 1] = "Local";
    ParserVariableDeclaration[ParserVariableDeclaration["FunctionArgument"] = 2] = "FunctionArgument";
})(ParserVariableDeclaration = exports.ParserVariableDeclaration || (exports.ParserVariableDeclaration = {}));
var Parser = (function () {
    function Parser(input, options) {
        if (options === void 0) { options = {}; }
        this.input = input;
        this.addMissingReturn = utils_1.exists(options.addMissingReturn) ? options.addMissingReturn : false;
        this.variableHook = utils_1.exists(options.variableHook) ? options.variableHook : function (identifier) { return identifier; };
        this.variableDeclarationHook = utils_1.exists(options.variableDeclarationHook) ? options.variableDeclarationHook : function (identifier) { return identifier; };
        this.filterExpressionHook = utils_1.exists(options.filterExpressionHook) ? options.filterExpressionHook : function (filter) { return filter; };
        this.progress = new ParserScopeProgress;
    }
    Parser.createFromString = function (input, options) {
        if (options === void 0) { options = {}; }
        return new Parser(new tokenizer_2.Tokenizer(new tokenizer_1.InputStream(input)), options);
    };
    Parser.prototype.parse = function () {
        var statements = [];
        while (!this.input.eof()) {
            statements.push(this.matchTopLevelStatement(this.progress));
            if (!this.input.eof()) {
                if (!this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, ';')) {
                    this.input.unexpected(tokenizer_2.TokenType[this.input.current().type], this.input.current().value);
                }
                this.input.matchToken(tokenizer_2.TokenType.Punctuation, ';');
            }
        }
        this.addMissingReturnStatement(this.progress, statements);
        return new _.ASTProgram(statements);
    };
    Parser.prototype.callVariableHook = function (progress, variable) {
        var updated = this.variableHook(variable, progress.getVariableDeclaration(variable.name));
        return utils_1.exists(updated) ? updated : variable;
    };
    Parser.prototype.callVariableDeclarationHook = function (variable) {
        var updated = this.variableDeclarationHook(variable);
        return utils_1.exists(updated) ? updated : variable;
    };
    Parser.prototype.callFilterExpressionHook = function (filter) {
        var updated = this.filterExpressionHook(filter);
        return utils_1.exists(updated) ? updated : filter;
    };
    Parser.prototype.matchTopLevelStatement = function (progress) {
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Keyword, 'let')) {
            return this.callVariableDeclarationHook(this.matchVariableDeclaration(progress));
        }
        return this.matchExpression(progress, true);
    };
    Parser.prototype.matchSimpleExpression = function (progress, identifierIsVariable) {
        if (isArrayFunctionExpression(this.input)) {
            return this.matchArrowFunctionExpression(progress);
        }
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Keyword, 'true', 'false')) {
            return this.matchBooleanLiteral();
        }
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Keyword, 'return')) {
            return this.matchReturnStatement(progress);
        }
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Keyword, 'void')) {
            return this.matchVoidStatement(progress);
        }
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Keyword, 'new')) {
            return this.matchNewExpression(progress);
        }
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Keyword, 'null')) {
            return this.matchNullLiteral();
        }
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Keyword, 'debugger')) {
            return this.matchDebuggerStatement();
        }
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Keyword, 'throw')) {
            return this.matchThrowStatement(progress);
        }
        if (this.input.isCurrentToken(tokenizer_2.TokenType.String)) {
            return this.matchStringLiteral();
        }
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Number)) {
            return this.matchNumericLiteral();
        }
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Name)) {
            var identifier = this.matchIdentifier();
            return identifierIsVariable ? this.callVariableHook(progress, identifier) : identifier;
        }
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Operator, '/')) {
            return this.matchRegExpLiteral();
        }
        if ((_a = this.input).isCurrentToken.apply(_a, [tokenizer_2.TokenType.Operator].concat(data_1.UNARY_OPERATORS))) {
            return this.matchUnaryExpression(progress);
        }
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, '[')) {
            return this.matchArrayExpression(progress);
        }
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, '{')) {
            return this.matchObjectExpression(progress);
        }
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, '(')) {
            return this.matchBlockStatement(progress);
        }
        var _a;
    };
    Parser.prototype.matchExpression = function (progress, allowFilters, stopOnFilter, stopOnParenthesis, identifierIsVariable) {
        if (allowFilters === void 0) { allowFilters = false; }
        if (stopOnFilter === void 0) { stopOnFilter = false; }
        if (stopOnParenthesis === void 0) { stopOnParenthesis = false; }
        if (identifierIsVariable === void 0) { identifierIsVariable = true; }
        return this.matchPostExpression(progress, this.matchSimpleExpression(progress, identifierIsVariable), allowFilters, stopOnFilter, stopOnParenthesis);
    };
    Parser.prototype.matchPostExpression = function (progress, expression, allowFilters, stopOnFilter, stopOnParenthesis) {
        if (allowFilters === void 0) { allowFilters = false; }
        if (stopOnFilter === void 0) { stopOnFilter = false; }
        if (stopOnParenthesis === void 0) { stopOnParenthesis = false; }
        var updated;
        if (stopOnFilter && this.input.isCurrentToken(tokenizer_2.TokenType.Operator, '|') && this.input.isNextToken(tokenizer_2.TokenType.Name)) {
            return expression;
        }
        if (stopOnParenthesis && this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, '(')) {
            return expression;
        }
        if (allowFilters && this.input.isCurrentToken(tokenizer_2.TokenType.Operator, '|') && this.input.isNextToken(tokenizer_2.TokenType.Name)) {
            updated = this.callFilterExpressionHook(this.matchFilterExpression(progress, expression));
        }
        else if ((_a = this.input).isCurrentToken.apply(_a, [tokenizer_2.TokenType.Operator].concat(data_1.ASSIGNMENT_OPERATORS))) {
            updated = this.matchAssignmentExpression(progress, expression);
        }
        else if ((_b = this.input).isCurrentToken.apply(_b, [tokenizer_2.TokenType.Operator].concat(data_1.UPDATE_OPERATORS))) {
            updated = this.matchUpdateExpression(expression);
        }
        else if ((_c = this.input).isCurrentToken.apply(_c, [tokenizer_2.TokenType.Operator].concat(data_1.BINARY_OPERATORS))) {
            updated = this.matchBinaryExpression(progress, expression);
        }
        else if ((_d = this.input).isCurrentToken.apply(_d, [tokenizer_2.TokenType.Operator].concat(data_1.LOGICAL_OPERATORS))) {
            updated = this.matchLogicalExpression(progress, expression);
        }
        else if (this.input.isCurrentToken(tokenizer_2.TokenType.Operator, '?')) {
            updated = this.matchConditionalExpression(progress, expression);
        }
        else if (this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, '(')) {
            updated = this.matchCallExpression(progress, expression);
        }
        else if (this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, '.') || (this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, '['))) {
            updated = this.matchMemberExpression(progress, expression);
        }
        if (updated) {
            return this.matchPostExpression(progress, updated, allowFilters);
        }
        return expression;
        var _a, _b, _c, _d;
    };
    Parser.prototype.matchDelimited = function (start, stop, separator, parser) {
        var a = [];
        var first = true;
        this.input.matchToken(tokenizer_2.TokenType.Punctuation, start);
        while (!this.input.eof()) {
            if (this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, stop)) {
                break;
            }
            if (first) {
                first = false;
            }
            else {
                this.input.matchToken(tokenizer_2.TokenType.Punctuation, separator);
            }
            if (this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, stop)) {
                break;
            }
            a.push(parser());
        }
        this.input.matchToken(tokenizer_2.TokenType.Punctuation, stop);
        return a;
    };
    Parser.prototype.matchVariableDeclaration = function (progress) {
        this.input.matchToken(tokenizer_2.TokenType.Keyword, 'let');
        var name = this.matchIdentifier();
        var init;
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Operator, '=')) {
            this.input.matchToken(tokenizer_2.TokenType.Operator, '=');
            init = this.matchExpression(progress);
        }
        progress.addVariable(name.name, ParserVariableDeclaration.Local);
        return new _.ASTVariableDeclaration(name, init);
    };
    Parser.prototype.matchBooleanLiteral = function () {
        var value = this.input.matchToken(tokenizer_2.TokenType.Keyword, 'true', 'false').value;
        return new _.ASTBooleanLiteral(value === 'true');
    };
    Parser.prototype.matchStringLiteral = function () {
        return new _.ASTStringLiteral(this.input.matchToken(tokenizer_2.TokenType.String).value);
    };
    Parser.prototype.matchNumericLiteral = function () {
        return new _.ASTNumericLiteral(parseFloat(this.input.matchToken(tokenizer_2.TokenType.Number).value));
    };
    Parser.prototype.matchNullLiteral = function () {
        this.input.matchToken(tokenizer_2.TokenType.Keyword, 'null');
        return new _.ASTNullLiteral;
    };
    Parser.prototype.matchRegExpLiteral = function () {
        this.input.matchToken(tokenizer_2.TokenType.Operator, '/');
        var pattern = '';
        var flags = '';
        while (!this.input.eof()) {
            if (this.input.current().value === '/') {
                break;
            }
            pattern += this.input.next().value;
        }
        this.input.matchToken(tokenizer_2.TokenType.Operator, '/');
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Name)) {
            flags = this.input.matchToken(tokenizer_2.TokenType.Name).value;
        }
        return new _.ASTRegExpLiteral(pattern, flags);
    };
    Parser.prototype.matchIdentifier = function () {
        return new _.ASTIdentifier(this.input.matchToken(tokenizer_2.TokenType.Name).value);
    };
    Parser.prototype.matchCallExpression = function (progress, callee) {
        var _this = this;
        return new _.ASTCallExpression(callee, this.matchDelimited('(', ')', ',', function () { return _this.matchExpression(progress); }));
    };
    Parser.prototype.matchArrayExpression = function (progress) {
        var _this = this;
        return new _.ASTArrayExpression(this.matchDelimited('[', ']', ',', function () { return _this.matchExpression(progress); }));
    };
    Parser.prototype.matchObjectExpression = function (progress) {
        var _this = this;
        return new _.ASTObjectExpression(this.matchDelimited('{', '}', ',', function () { return _this.matchObjectMember(progress); }));
    };
    Parser.prototype.matchObjectMember = function (progress) {
        var key = this.matchExpression(progress, false, false, false, false);
        this.input.matchToken(tokenizer_2.TokenType.Operator, ':');
        var value = this.matchExpression(progress);
        return new _.ASTObjectMember(key, value);
    };
    Parser.prototype.matchAssignmentExpression = function (progress, left) {
        return new _.ASTAssignmentExpression((_a = this.input).matchToken.apply(_a, [tokenizer_2.TokenType.Operator].concat(data_1.ASSIGNMENT_OPERATORS)).value, left, this.matchExpression(progress));
        var _a;
    };
    Parser.prototype.matchUpdateExpression = function (argument) {
        return new _.ASTUpdateExpression((_a = this.input).matchToken.apply(_a, [tokenizer_2.TokenType.Operator].concat(data_1.UPDATE_OPERATORS)).value, argument);
        var _a;
    };
    Parser.prototype.matchUnaryExpression = function (progress) {
        return new _.ASTUnaryExpression((_a = this.input).matchToken.apply(_a, [tokenizer_2.TokenType.Operator].concat(data_1.UNARY_OPERATORS)).value, this.matchExpression(progress));
        var _a;
    };
    Parser.prototype.matchBinaryExpression = function (progress, left) {
        return new _.ASTBinaryExpression((_a = this.input).matchToken.apply(_a, [tokenizer_2.TokenType.Operator].concat(data_1.BINARY_OPERATORS)).value, left, this.matchExpression(progress));
        var _a;
    };
    Parser.prototype.matchLogicalExpression = function (progress, left) {
        return new _.ASTLogicalExpression((_a = this.input).matchToken.apply(_a, [tokenizer_2.TokenType.Operator].concat(data_1.LOGICAL_OPERATORS)).value, left, this.matchExpression(progress));
        var _a;
    };
    Parser.prototype.matchMemberExpression = function (progress, object) {
        var property;
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, '.')) {
            this.input.matchToken(tokenizer_2.TokenType.Punctuation, '.');
            property = this.matchIdentifier();
        }
        else if (this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, '[')) {
            property = this.matchArrayExpression(progress);
        }
        return new _.ASTMemberExpression(object, property);
    };
    Parser.prototype.matchFilterExpression = function (progress, modify) {
        this.input.matchToken(tokenizer_2.TokenType.Operator, '|');
        var name = this.matchIdentifier();
        var args = [];
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Operator, ':')) {
            var first = true;
            this.input.matchToken(tokenizer_2.TokenType.Operator, ':');
            while (!this.input.eof()) {
                if (this.input.isCurrentToken(tokenizer_2.TokenType.Operator, '|') || this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, ')')) {
                    break;
                }
                if (first) {
                    first = false;
                }
                else {
                    this.input.matchToken(tokenizer_2.TokenType.Operator, ':');
                }
                if (this.input.isCurrentToken(tokenizer_2.TokenType.Operator, '|') || this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, ')')) {
                    break;
                }
                args.push(this.matchExpression(progress, false, true));
            }
        }
        return new _.ASTFilterExpression(name, modify, args);
    };
    Parser.prototype.matchBlockStatement = function (progress) {
        var _this = this;
        return new _.ASTBlockStatement(this.matchDelimited('(', ')', ';', function () { return _this.matchExpression(progress, true); }));
    };
    Parser.prototype.matchArrowFunctionExpression = function (progress) {
        var _this = this;
        progress = progress.fork();
        var body;
        var args = this.matchDelimited('(', ')', ',', function () {
            var argument = _this.matchIdentifier();
            progress.addVariable(argument.name, ParserVariableDeclaration.FunctionArgument);
            return argument;
        });
        this.input.matchToken(tokenizer_2.TokenType.Punctuation, '=>');
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, '{')) {
            body = this.matchDelimited('{', '}', ';', function () { return _this.matchTopLevelStatement(progress); });
            this.addMissingReturnStatement(progress, body);
        }
        else {
            body = new _.ASTReturnStatement(this.matchExpression(progress));
        }
        return new _.ASTArrowFunctionExpression(args, body);
    };
    Parser.prototype.matchReturnStatement = function (progress) {
        this.input.matchToken(tokenizer_2.TokenType.Keyword, 'return');
        var argument;
        if (!this.input.eof() && !this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, ';')) {
            argument = this.matchExpression(progress);
        }
        progress.hasReturn = true;
        return new _.ASTReturnStatement(argument);
    };
    Parser.prototype.matchVoidStatement = function (progress) {
        this.input.matchToken(tokenizer_2.TokenType.Keyword, 'void');
        var argument;
        if (!this.input.eof() && !this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, ';')) {
            argument = this.matchExpression(progress);
        }
        return new _.ASTVoidStatement(argument);
    };
    Parser.prototype.matchNewExpression = function (progress) {
        var _this = this;
        this.input.matchToken(tokenizer_2.TokenType.Keyword, 'new');
        var callee = this.matchExpression(progress, false, false, true);
        var args = [];
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Punctuation, '(')) {
            args = this.matchDelimited('(', ')', ',', function () { return _this.matchExpression(progress); });
        }
        return new _.ASTNewExpression(callee, args);
    };
    Parser.prototype.matchConditionalExpression = function (progress, test) {
        this.input.matchToken(tokenizer_2.TokenType.Operator, '?');
        var alternate = this.matchExpression(progress);
        var consequent;
        if (this.input.isCurrentToken(tokenizer_2.TokenType.Operator, ':')) {
            this.input.matchToken(tokenizer_2.TokenType.Operator, ':');
            consequent = this.matchExpression(progress);
        }
        else {
            consequent = new _.ASTUnaryExpression('void', new _.ASTNumericLiteral(0));
        }
        return new _.ASTConditionalExpression(test, alternate, consequent);
    };
    Parser.prototype.matchDebuggerStatement = function () {
        this.input.matchToken(tokenizer_2.TokenType.Keyword, 'debugger');
        return new _.ASTDebuggerStatement;
    };
    Parser.prototype.matchThrowStatement = function (progress) {
        this.input.matchToken(tokenizer_2.TokenType.Keyword, 'throw');
        return new _.ASTThrowStatement(this.matchExpression(progress));
    };
    Parser.prototype.addMissingReturnStatement = function (progress, statements) {
        if (this.addMissingReturn && !progress.hasReturn) {
            for (var i = statements.length - 1; i >= 0; i--) {
                if (statements[i] instanceof _.ASTExpression || statements[i] instanceof _.ASTBlockStatement) {
                    statements[i] = new _.ASTReturnStatement(statements[i]);
                    break;
                }
            }
        }
    };
    return Parser;
}());
exports.Parser = Parser;
var ParserScopeProgress = (function () {
    function ParserScopeProgress() {
        this.hasReturn = false;
        this.variables = {};
    }
    ParserScopeProgress.prototype.fork = function () {
        var parser = new ParserScopeProgress;
        parser.variables = utils_1.clone(this.variables);
        return parser;
    };
    ParserScopeProgress.prototype.addVariable = function (name, declaration) {
        if (!utils_1.exists(this.variables[name])) {
            this.variables[name] = declaration;
        }
    };
    ParserScopeProgress.prototype.getVariableDeclaration = function (name) {
        if (utils_1.exists(this.variables[name])) {
            return this.variables[name];
        }
        return ParserVariableDeclaration.Global;
    };
    return ParserScopeProgress;
}());
function isArrayFunctionExpression(input) {
    if (!input.isCurrentToken(tokenizer_2.TokenType.Punctuation, '(')) {
        return false;
    }
    var no = function () {
        input.resetPeek();
        return false;
    };
    if (!input.isNextToken(tokenizer_2.TokenType.Punctuation, ')')) {
        var peek = void 0;
        while (peek = input.peek()) {
            if (!input.isToken(peek, tokenizer_2.TokenType.Name)) {
                return no();
            }
            peek = input.peek();
            if (input.isToken(peek, tokenizer_2.TokenType.Punctuation, ')')) {
                break;
            }
            if (!input.isToken(peek, tokenizer_2.TokenType.Punctuation, ',')) {
                return no();
            }
        }
    }
    else if (!input.isPeek(tokenizer_2.TokenType.Punctuation, ')')) {
        return no();
    }
    if (!input.isPeek(tokenizer_2.TokenType.Punctuation, '=>')) {
        return no();
    }
    input.resetPeek();
    return true;
}
