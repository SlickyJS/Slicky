"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var TemplatesProvider = (function () {
    function TemplatesProvider(platform, extensions, applicationTemplate, directivesProvider) {
        this.platform = platform;
        this.extensions = extensions;
        this.applicationTemplate = applicationTemplate;
        this.directivesProvider = directivesProvider;
    }
    TemplatesProvider.prototype.createComponentTemplate = function (container, parentTemplate, metadata, component) {
        var templateType = this.platform.compileComponentTemplate(metadata);
        var template = new templateType(this.applicationTemplate, parentTemplate);
        template.disableProvidersFromParent();
        template.disableParametersFromParent();
        template.disableFiltersFromParent();
        template.addProvider('component', component);
        template.addProvider('container', container);
        template.addProvider('templatesProvider', this);
        template.addProvider('directivesProvider', this.directivesProvider);
        utils_1.forEach(metadata.filters, function (filterData) {
            var filter = container.create(filterData.filterType);
            template.addFilter(filterData.metadata.name, function (obj, args) {
                return filter.transform.apply(filter, [obj].concat(args));
            });
        });
        return template;
    };
    TemplatesProvider.prototype.createFrom = function (hash, el, parent, setup) {
        if (setup === void 0) { setup = null; }
        var container = parent.getProvider('container').fork();
        var metadata = this.directivesProvider.getDirectiveMetadataByHash(hash);
        var component = this.directivesProvider.create(metadata.hash, el, container);
        this.extensions.doInitComponentContainer(container, metadata, component);
        var template = this.createComponentTemplate(container, parent, metadata, component);
        if (utils_1.isFunction(setup)) {
            setup(template, component);
        }
        return template;
    };
    return TemplatesProvider;
}());
exports.TemplatesProvider = TemplatesProvider;
