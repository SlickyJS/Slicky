"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@slicky/core");
var utils_1 = require("@slicky/utils");
var directivesProvider_1 = require("./directivesProvider");
var templatesProvider_1 = require("./templatesProvider");
var RootDirectiveRunner = (function () {
    function RootDirectiveRunner(platform, template, container, metadataLoader, extensions, el) {
        this.platform = platform;
        this.template = template;
        this.container = container;
        this.metadataLoader = metadataLoader;
        this.extensions = extensions;
        this.el = el;
        this.directivesProvider = new directivesProvider_1.DirectivesProvider(this.extensions, this.metadataLoader);
        this.templatesProvider = new templatesProvider_1.TemplatesProvider(this.platform, this.extensions, this.template, this.directivesProvider);
    }
    RootDirectiveRunner.prototype.run = function (directiveType) {
        var _this = this;
        var metadata = this.metadataLoader.load(directiveType);
        var els = this.el.querySelectorAll(metadata.selector);
        utils_1.forEach(els, function (el) { return _this.runDirective(metadata, el); });
    };
    RootDirectiveRunner.prototype.runDirective = function (metadata, el) {
        var container = metadata.type === core_1.DirectiveDefinitionType.Component ? this.container.fork() : this.container;
        var directive = this.directivesProvider.create(metadata.hash, el, container);
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
            this.extensions.doInitComponentContainer(container, metadata, directive);
            this.runComponentTemplate(container, metadata, directive, el);
        }
        if (utils_1.isFunction(directive['onInit'])) {
            directive.onInit();
        }
    };
    RootDirectiveRunner.prototype.runComponentTemplate = function (container, metadata, component, el) {
        var template = this.templatesProvider.createComponentTemplate(container, this.template, metadata, component);
        template.render(el);
    };
    return RootDirectiveRunner;
}());
exports.RootDirectiveRunner = RootDirectiveRunner;
