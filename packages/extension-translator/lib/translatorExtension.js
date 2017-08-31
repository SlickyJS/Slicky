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
var core_1 = require("@slicky/core");
var translator_1 = require("@slicky/translator");
var utils_1 = require("@slicky/utils");
var translatorFilter_1 = require("./translatorFilter");
var componentTranslator_1 = require("./componentTranslator");
var TranslatorExtension = (function (_super) {
    __extends(TranslatorExtension, _super);
    function TranslatorExtension(locale) {
        var _this = _super.call(this) || this;
        _this.translator = new translator_1.Translator(locale);
        return _this;
    }
    TranslatorExtension.prototype.getServices = function () {
        return [
            {
                service: translator_1.Translator,
                options: {
                    useValue: this.translator,
                },
            },
        ];
    };
    TranslatorExtension.prototype.getFilters = function () {
        return [
            translatorFilter_1.TranslatorFilter,
        ];
    };
    TranslatorExtension.prototype.doUpdateDirectiveMetadata = function (directiveType, metadata, options) {
        if (metadata.type === core_1.DirectiveDefinitionType.Component && utils_1.exists(options.translations)) {
            metadata.translations = options.translations;
        }
    };
    TranslatorExtension.prototype.doInitComponentContainer = function (container, metadata, component) {
        var _this = this;
        if (!utils_1.exists(metadata.translations)) {
            return;
        }
        container.addService(componentTranslator_1.ComponentTranslator, {
            useFactory: function () {
                var translator = _this.translator.fork();
                translator.addMessages(metadata.translations);
                return new componentTranslator_1.ComponentTranslator(translator);
            },
        });
    };
    return TranslatorExtension;
}(core_1.AbstractExtension));
exports.TranslatorExtension = TranslatorExtension;
