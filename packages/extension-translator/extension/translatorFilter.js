"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@slicky/core");
var componentTranslator_1 = require("./componentTranslator");
var TranslatorFilter = (function () {
    function TranslatorFilter(translator) {
        this.translator = translator;
    }
    TranslatorFilter.prototype.transform = function (message, countOrParameters, parameters) {
        if (countOrParameters === void 0) { countOrParameters = null; }
        if (parameters === void 0) { parameters = {}; }
        return this.translator.translate(message, countOrParameters, parameters);
    };
    TranslatorFilter = __decorate([
        core_1.Filter({
            name: 'translate',
        }),
        __metadata("design:paramtypes", [componentTranslator_1.ComponentTranslator])
    ], TranslatorFilter);
    return TranslatorFilter;
}());
exports.TranslatorFilter = TranslatorFilter;
