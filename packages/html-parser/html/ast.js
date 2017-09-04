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
var ASTHTMLNode = (function () {
    function ASTHTMLNode() {
    }
    return ASTHTMLNode;
}());
exports.ASTHTMLNode = ASTHTMLNode;
var ASTHTMLNodeBaseText = (function (_super) {
    __extends(ASTHTMLNodeBaseText, _super);
    function ASTHTMLNodeBaseText(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    return ASTHTMLNodeBaseText;
}(ASTHTMLNode));
exports.ASTHTMLNodeBaseText = ASTHTMLNodeBaseText;
var ASTHTMLNodeText = (function (_super) {
    __extends(ASTHTMLNodeText, _super);
    function ASTHTMLNodeText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ASTHTMLNodeText;
}(ASTHTMLNodeBaseText));
exports.ASTHTMLNodeText = ASTHTMLNodeText;
var ASTHTMLNodeExpression = (function (_super) {
    __extends(ASTHTMLNodeExpression, _super);
    function ASTHTMLNodeExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ASTHTMLNodeExpression;
}(ASTHTMLNodeBaseText));
exports.ASTHTMLNodeExpression = ASTHTMLNodeExpression;
var ASTHTMLNodeParent = (function (_super) {
    __extends(ASTHTMLNodeParent, _super);
    function ASTHTMLNodeParent(childNodes) {
        if (childNodes === void 0) { childNodes = []; }
        var _this = _super.call(this) || this;
        _this.childNodes = childNodes;
        return _this;
    }
    return ASTHTMLNodeParent;
}(ASTHTMLNode));
exports.ASTHTMLNodeParent = ASTHTMLNodeParent;
var ASTHTMLNodeDocumentFragment = (function (_super) {
    __extends(ASTHTMLNodeDocumentFragment, _super);
    function ASTHTMLNodeDocumentFragment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ASTHTMLNodeDocumentFragment;
}(ASTHTMLNodeParent));
exports.ASTHTMLNodeDocumentFragment = ASTHTMLNodeDocumentFragment;
var ASTHTMLNodeAttribute = (function () {
    function ASTHTMLNodeAttribute(name, value) {
        this.name = name;
        this.value = value;
    }
    return ASTHTMLNodeAttribute;
}());
exports.ASTHTMLNodeAttribute = ASTHTMLNodeAttribute;
var ASTHTMLNodeTextAttribute = (function (_super) {
    __extends(ASTHTMLNodeTextAttribute, _super);
    function ASTHTMLNodeTextAttribute() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ASTHTMLNodeTextAttribute;
}(ASTHTMLNodeAttribute));
exports.ASTHTMLNodeTextAttribute = ASTHTMLNodeTextAttribute;
var ASTHTMLNodeExpressionAttribute = (function (_super) {
    __extends(ASTHTMLNodeExpressionAttribute, _super);
    function ASTHTMLNodeExpressionAttribute() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ASTHTMLNodeExpressionAttribute;
}(ASTHTMLNodeAttribute));
exports.ASTHTMLNodeExpressionAttribute = ASTHTMLNodeExpressionAttribute;
var ASTHTMLNodeExpressionAttributeEvent = (function (_super) {
    __extends(ASTHTMLNodeExpressionAttributeEvent, _super);
    function ASTHTMLNodeExpressionAttributeEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.preventDefault = false;
        return _this;
    }
    return ASTHTMLNodeExpressionAttributeEvent;
}(ASTHTMLNodeExpressionAttribute));
exports.ASTHTMLNodeExpressionAttributeEvent = ASTHTMLNodeExpressionAttributeEvent;
var ASTHTMLNodeComment = (function (_super) {
    __extends(ASTHTMLNodeComment, _super);
    function ASTHTMLNodeComment(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    return ASTHTMLNodeComment;
}(ASTHTMLNode));
exports.ASTHTMLNodeComment = ASTHTMLNodeComment;
var ASTHTMLNodeElement = (function (_super) {
    __extends(ASTHTMLNodeElement, _super);
    function ASTHTMLNodeElement(name, childNodes) {
        if (childNodes === void 0) { childNodes = []; }
        var _this = _super.call(this, childNodes) || this;
        _this.attributes = [];
        _this.events = [];
        _this.properties = [];
        _this.exports = [];
        _this.templates = [];
        _this.name = name;
        return _this;
    }
    return ASTHTMLNodeElement;
}(ASTHTMLNodeParent));
exports.ASTHTMLNodeElement = ASTHTMLNodeElement;
var AST = (function () {
    function AST() {
    }
    AST.prototype.createDocumentFragment = function () {
        return new ASTHTMLNodeDocumentFragment;
    };
    AST.prototype.createElement = function (tagName, namespaceURI, attrs) {
        var element = new ASTHTMLNodeElement(tagName);
        this.processAttributes(element, attrs);
        return element;
    };
    AST.prototype.appendChild = function (parentNode, newNode) {
        parentNode.childNodes.push(newNode);
        newNode.parentNode = parentNode;
    };
    AST.prototype.insertBefore = function (parentNode, newNode, referenceNode) {
        var pos = parentNode.childNodes.indexOf(referenceNode);
        parentNode.childNodes.splice(pos, 0, newNode);
        newNode.parentNode = parentNode;
    };
    AST.prototype.setTemplateContent = function (templateElement, contentElement) {
        templateElement.content = contentElement;
    };
    AST.prototype.getTemplateContent = function (templateElement) {
        return templateElement.content;
    };
    AST.prototype.detachNode = function (node) {
        if (node.parentNode) {
            var pos = node.parentNode.childNodes.indexOf(node);
            node.parentNode.childNodes.splice(pos, 1);
            node.parentNode = null;
        }
    };
    AST.prototype.insertText = function (parentNode, text) {
        if (parentNode.childNodes.length) {
            var prevNode = parentNode.childNodes[parentNode.childNodes.length - 1];
            if (prevNode instanceof ASTHTMLNodeText) {
                prevNode.value += text;
                return;
            }
        }
        this.appendChild(parentNode, this.createTextNode(text));
    };
    AST.prototype.insertTextBefore = function (parentNode, text, referenceNode) {
        var prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];
        if (prevNode && prevNode instanceof ASTHTMLNodeText) {
            prevNode.value += text;
        }
        else {
            this.insertBefore(parentNode, this.createTextNode(text), referenceNode);
        }
    };
    AST.prototype.insertExpressionBefore = function (parentNode, expression, referenceNode) {
        var prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];
        if (prevNode && prevNode instanceof ASTHTMLNodeExpression) {
            prevNode.value += expression;
        }
        else {
            this.insertBefore(parentNode, this.createExpressionNode(expression), referenceNode);
        }
    };
    AST.prototype.createCommentNode = function (data) {
        return new ASTHTMLNodeComment(data);
    };
    AST.prototype.getFirstChild = function (node) {
        return node.childNodes[0];
    };
    AST.prototype.getParentNode = function (node) {
        return node.parentNode;
    };
    AST.prototype.getTagName = function (element) {
        return element.name;
    };
    AST.prototype.getAttrList = function (element) {
        return element.attributes;
    };
    AST.prototype.getNamespaceURI = function (element) {
        return undefined;
    };
    AST.prototype.createDocument = function () {
        throw new Error('not implemented');
    };
    AST.prototype.getChildNodes = function (node) {
        throw new Error('not implemented');
    };
    AST.prototype.setDocumentType = function (document, name, publicId, systemId) {
        throw new Error('not implemented');
    };
    AST.prototype.setDocumentMode = function (document, mode) {
        throw new Error('not implemented');
    };
    AST.prototype.getDocumentMode = function (document) {
        throw new Error('not implemented');
    };
    AST.prototype.adoptAttributes = function (recipient, attrs) {
        throw new Error('not implemented');
    };
    AST.prototype.getTextNodeContent = function (textNode) {
        throw new Error('not implemented');
    };
    AST.prototype.getCommentNodeContent = function (commentNode) {
        throw new Error('not implemented');
    };
    AST.prototype.getDocumentTypeNodeName = function (doctypeNode) {
        throw new Error('not implemented');
    };
    AST.prototype.getDocumentTypeNodePublicId = function (doctypeNode) {
        throw new Error('not implemented');
    };
    AST.prototype.getDocumentTypeNodeSystemId = function (doctypeNode) {
        throw new Error('not implemented');
    };
    AST.prototype.isTextNode = function (node) {
        throw new Error('not implemented');
    };
    AST.prototype.isCommentNode = function (node) {
        throw new Error('not implemented');
    };
    AST.prototype.isDocumentTypeNode = function (node) {
        throw new Error('not implemented');
    };
    AST.prototype.isElementNode = function (node) {
        throw new Error('not implemented');
    };
    AST.prototype.processAttributes = function (element, attrs) {
        utils_1.forEach(attrs, function (attribute) {
            if (attribute.name.match(/^\(.+\)$/)) {
                var eventsName = attribute.name.substring(1, attribute.name.length - 1).split('|');
                utils_1.forEach(eventsName, function (eventName) {
                    var eventNameParts = eventName.split('.');
                    var event = new ASTHTMLNodeExpressionAttributeEvent(eventNameParts[0], attribute.value);
                    if (utils_1.exists(eventNameParts[1]) && eventNameParts[1] === 'prevent') {
                        event.preventDefault = true;
                    }
                    element.events.push(event);
                });
            }
            else if (attribute.name.match(/^\[.+\]/)) {
                element.properties.push(new ASTHTMLNodeExpressionAttribute(attribute.name.substring(1, attribute.name.length - 1), attribute.value));
            }
            else if (attribute.name.charAt(0) === '#') {
                element.exports.push(new ASTHTMLNodeTextAttribute(attribute.name.substring(1), attribute.value));
            }
            else if (attribute.name.charAt(0) === '*') {
                element.templates.push(new ASTHTMLNodeExpressionAttribute(attribute.name.substring(1), attribute.value));
            }
            else {
                element.attributes.push(new ASTHTMLNodeTextAttribute(attribute.name, attribute.value));
            }
        });
    };
    AST.prototype.createTextNode = function (text) {
        return new ASTHTMLNodeText(text);
    };
    AST.prototype.createExpressionNode = function (expression) {
        return new ASTHTMLNodeExpression(expression);
    };
    return AST;
}());
exports.AST = AST;
