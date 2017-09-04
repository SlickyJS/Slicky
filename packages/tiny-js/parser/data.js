"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEYWORDS = [
    'true', 'false', 'null', 'undefined', 'let', 'new', 'debugger', 'instanceof', 'return', 'void', 'instanceof', 'in', 'throw',
];
exports.PUNCTUATIONS = [
    '=>',
    '.', ',', ';', '(', ')', '{', '}', '[', ']',
];
exports.OPERATORS = [
    'typeof', 'void', 'delete',
    '>>>=',
    '===', '!==', '>>>', '<<=', '>>=',
    '==', '!=', '<=', '>=', '<<', '>>', '--', '++', '+=', '-=', '*=', '/=', '%=', '|=', '^=', '&=', '||', '&&',
    '<', '>', '+', '-', '*', '/', '%', '|', '^', '&', '!', '~', '=', '?', ':',
];
exports.ASSIGNMENT_OPERATORS = [
    '>>>=',
    '<<=', '>>=',
    '+=', '-=', '*=', '/=', '%=', '|=', '^=', '&=',
    '=',
];
exports.UPDATE_OPERATORS = [
    '--', '++',
];
exports.BINARY_OPERATORS = [
    'instanceof',
    '===', '!==', '>>>',
    '==', '!=', '<=', '>=', '<<', '>>', 'in',
    '<', '>', '+', '-', '*', '/', '%', '|', '^', '&',
];
exports.LOGICAL_OPERATORS = [
    '||', '&&',
];
exports.UNARY_OPERATORS = [
    'typeof', 'delete', 'void',
    '-', '+', '!', '~',
];
