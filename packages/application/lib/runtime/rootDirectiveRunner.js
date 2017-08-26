"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@slicky/core");
var utils_1 = require("@slicky/utils");
var directivesProvider_1 = require("./directivesProvider");
var templatesProvider_1 = require("./templatesProvider");
var RootDirectiveRunner = (function () {
    function RootDirectiveRunner(platform, template, container, metadataLoader, document) {
        this.platform = platform;
        this.template = template;
        this.container = container;
        this.metadataLoader = metadataLoader;
        this.document = document;
        this.directivesProvider = new directivesProvider_1.DirectivesProvider(this.metadataLoader);
        this.templatesProvider = new templatesProvider_1.TemplatesProvider(this.platform, this.template);
    }
    RootDirectiveRunner.prototype.run = function (directiveType) {
        var _this = this;
        var metadata = this.metadataLoader.load(directiveType);
        var els = this.document.querySelectorAll(metadata.selector);
        utils_1.forEach(els, function (el) { return _this.runDirective(directiveType, metadata, el); });
    };
    RootDirectiveRunner.prototype.runDirective = function (directiveType, metadata, el) {
        var directive = this.container.create(directiveType);
        utils_1.forEach(metadata.inputs, function (input) {
            directive[input.property] = el.getAttribute(input.name);
        });
        utils_1.forEach(metadata.elements, function (element) {
            directive[element.property] = el.querySelector(element.selector);
        });
        utils_1.forEach(metadata.events, function (event) {
            var eventEl = utils_1.exists(event.hostElement) ? directive[event.hostElement] : el.querySelector(event.selector);
            eventEl.addEventListener(event.event, function (e) { return directive[event.method](e, eventEl); });
        });
        if (metadata.type === core_1.DirectiveDefinitionType.Component) {
            this.runComponentTemplate(metadata, directive, el);
        }
        if (utils_1.isFunction(directive['onInit'])) {
            directive.onInit();
        }
    };
    RootDirectiveRunner.prototype.runComponentTemplate = function (metadata, component, el) {
        var templateType = this.platform.compileComponentTemplate(metadata);
        var template = new templateType(this.template, this.template);
        template.addProvider('component', component);
        template.addProvider('container', this.container);
        template.addProvider('templatesProvider', this.templatesProvider);
        template.addProvider('directivesProvider', this.directivesProvider);
        template.render(el);
    };
    return RootDirectiveRunner;
}());
exports.RootDirectiveRunner = RootDirectiveRunner;
