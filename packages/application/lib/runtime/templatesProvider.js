"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TemplatesProvider = (function () {
    function TemplatesProvider(platform, applicationTemplate) {
        this.platform = platform;
        this.applicationTemplate = applicationTemplate;
    }
    TemplatesProvider.prototype.createFrom = function (hash, el, parent) {
        var container = parent.getProvider('container').fork();
        var directivesProvider = parent.getProvider('directivesProvider');
        var templateType = this.platform.getTemplateTypeByHash(hash);
        var template = new templateType(this.applicationTemplate, parent);
        var component = directivesProvider.create(hash, el, container);
        template.disableProvidersFromParent();
        template.disableParametersFromParent();
        template.addProvider('component', component);
        template.addProvider('container', container);
        template.addProvider('templatesProvider', this);
        template.addProvider('directivesProvider', directivesProvider);
        return template;
    };
    return TemplatesProvider;
}());
exports.TemplatesProvider = TemplatesProvider;
