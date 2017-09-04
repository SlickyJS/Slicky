"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var metadata_1 = require("@slicky/core/metadata");
var templates_1 = require("@slicky/templates");
var utils_1 = require("@slicky/utils");
var slickyEnginePlugin_1 = require("./slickyEnginePlugin");
var Compiler = (function () {
    function Compiler() {
        this.templates = {};
    }
    Compiler.prototype.compile = function (metadata) {
        if (utils_1.exists(this.templates[metadata.hash])) {
            return this.templates[metadata.hash];
        }
        if (metadata.type === metadata_1.DirectiveDefinitionType.Directive) {
            return;
        }
        this.createEngine(metadata).compile(metadata.hash, metadata.template);
        return this.templates[metadata.hash];
    };
    Compiler.prototype.getTemplates = function () {
        return this.templates;
    };
    Compiler.prototype.getTemplateByHash = function (hash) {
        return this.templates[hash];
    };
    Compiler.prototype.createEngine = function (metadata) {
        var _this = this;
        var plugin = new slickyEnginePlugin_1.SlickyEnginePlugin(this, metadata);
        var engine = new templates_1.Engine;
        engine.addPlugin(plugin);
        engine.compiled.subscribe(function (template) {
            _this.templates[template.name] = template.code;
        });
        return engine;
    };
    return Compiler;
}());
exports.Compiler = Compiler;
