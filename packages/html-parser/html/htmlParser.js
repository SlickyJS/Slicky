"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parse5_1 = require("parse5");
var utils_1 = require("@slicky/utils");
var tokenizer_1 = require("@slicky/tokenizer");
var text_1 = require("../text");
var _ = require("./ast");
var HTMLParser = (function () {
    function HTMLParser(input) {
        this.input = input;
        this.ast = new _.AST;
    }
    HTMLParser.prototype.parse = function () {
        var document = parse5_1.parseFragment(this.input, {
            treeAdapter: this.ast,
        });
        this.process(document);
        return document;
    };
    HTMLParser.prototype.process = function (document) {
        this.processChildNodes(document.childNodes);
    };
    HTMLParser.prototype.processChildNodes = function (childNodes) {
        for (var i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            if (node instanceof _.ASTHTMLNodeBaseText) {
                i += this.processText(node);
            }
            else if (node instanceof _.ASTHTMLNodeElement) {
                this.processElement(node);
            }
        }
    };
    HTMLParser.prototype.processText = function (text) {
        var _this = this;
        var tokens = this.tokenizeText(text.value);
        utils_1.forEach(tokens, function (token) {
            if (token instanceof text_1.TextTokenText) {
                _this.ast.insertTextBefore(text.parentNode, token.value, text);
            }
            else if (token instanceof text_1.TextTokenExpression) {
                _this.ast.insertExpressionBefore(text.parentNode, token.value, text);
            }
        });
        this.ast.detachNode(text);
        return tokens.length - 1;
    };
    HTMLParser.prototype.processElement = function (element) {
        if (utils_1.exists(element.templates)) {
            element = this.processElementTemplates(element);
        }
        element.attributes = this.processElementAttributes(element.attributes);
        this.processChildNodes(element.childNodes);
        if (element.content) {
            this.processChildNodes(element.content.childNodes);
        }
    };
    HTMLParser.prototype.processElementTemplates = function (element) {
        var _this = this;
        var templates = element.templates;
        element.templates = [];
        var templatesGroups = {};
        utils_1.forEach(templates, function (template) {
            var found = utils_1.find(utils_1.keys(templatesGroups), function (name) { return utils_1.startsWith(template.name, name); });
            if (!found) {
                templatesGroups[template.name] = [];
                found = template.name;
            }
            templatesGroups[found].push(template);
        });
        var marker = element;
        utils_1.forEach(templatesGroups, function (group) {
            var template = new _.ASTHTMLNodeElement('template');
            template.properties = group;
            if (marker === element) {
                _this.ast.insertBefore(marker.parentNode, template, marker);
            }
            else {
                _this.ast.appendChild(marker, template);
            }
            marker = template;
        });
        if (marker !== element) {
            this.ast.detachNode(element);
            this.ast.appendChild(marker, element);
        }
        return marker;
    };
    HTMLParser.prototype.processElementAttributes = function (attributes) {
        var _this = this;
        var result = [];
        utils_1.forEach(attributes, function (attribute) {
            var tokens = _this.tokenizeText(attribute.value);
            if (tokens.length === 0 || (tokens.length === 1 && tokens[0] instanceof text_1.TextTokenText)) {
                result.push(attribute);
            }
            else {
                result.push(new _.ASTHTMLNodeExpressionAttribute(attribute.name, utils_1.map(tokens, function (token) {
                    return (token instanceof text_1.TextTokenExpression) ?
                        "(" + token.value + ")" :
                        "\"" + token.value + "\"";
                }).join(' + ')));
            }
        });
        return result;
    };
    HTMLParser.prototype.tokenizeText = function (text) {
        return (new text_1.TextTokenizer(new tokenizer_1.InputStream(text))).tokenize();
    };
    return HTMLParser;
}());
exports.HTMLParser = HTMLParser;
