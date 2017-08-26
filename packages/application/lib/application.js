"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var core_1 = require("@slicky/core");
var templates_runtime_1 = require("@slicky/templates-runtime");
var runtime_1 = require("./runtime");
var Application = (function () {
    function Application(platform, template, container, options) {
        if (options === void 0) { options = {}; }
        this.platform = platform;
        this.template = template;
        this.container = container;
        this.document = utils_1.exists(options.document) ? options.document : document;
        this.appElement = utils_1.exists(options.appElement) ? options.appElement : this.document;
        this.directives = utils_1.exists(options.directives) ? options.directives : [];
    }
    Application.prototype.run = function () {
        templates_runtime_1.CommonTemplateHelpers.install(this.template);
        var runner = new runtime_1.RootDirectiveRunner(this.platform, this.template, this.container, new core_1.DirectiveMetadataLoader, this.document);
        utils_1.forEach(this.directives, function (directive) {
            runner.run(directive);
        });
    };
    return Application;
}());
exports.Application = Application;
