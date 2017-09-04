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
var translator_1 = require("@slicky/translator");
var di_1 = require("@slicky/di");
var ComponentTranslator = (function () {
    function ComponentTranslator(translator) {
        this.translator = translator;
    }
    ComponentTranslator.prototype.translate = function (message, countOrParameters, parameters) {
        if (countOrParameters === void 0) { countOrParameters = null; }
        if (parameters === void 0) { parameters = {}; }
        return this.translator.translate(message, countOrParameters, parameters);
    };
    ComponentTranslator = __decorate([
        di_1.Injectable(),
        __metadata("design:paramtypes", [translator_1.Translator])
    ], ComponentTranslator);
    return ComponentTranslator;
}());
exports.ComponentTranslator = ComponentTranslator;
