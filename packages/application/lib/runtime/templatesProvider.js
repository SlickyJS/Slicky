"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var TemplatesProvider = (function () {
    function TemplatesProvider(platform, applicationTemplate) {
        this.platform = platform;
        this.applicationTemplate = applicationTemplate;
    }
    TemplatesProvider.prototype.createFrom = function (hash, el, parent, setup) {
        if (setup === void 0) { setup = null; }
        var container = parent.getProvider('container').fork();
        var directivesProvider = parent.getProvider('directivesProvider');
        var templateType = this.platform.getTemplateTypeByHash(hash);
        var template = new templateType(this.applicationTemplate, parent);
        var component = directivesProvider.create(hash, el, container);
        var metadata = directivesProvider.getDirectiveMetadataByHash(hash);
        template.disableProvidersFromParent();
        template.disableParametersFromParent();
        template.disableFiltersFromParent();
        template.addProvider('component', component);
        template.addProvider('container', container);
        template.addProvider('templatesProvider', this);
        template.addProvider('directivesProvider', directivesProvider);
        utils_1.forEach(metadata.filters, function (filterData) {
            var filter = container.create(filterData.filterType);
            template.addFilter(filterData.metadata.name, function (obj, args) {
                return filter.transform.apply(filter, [obj].concat(args));
            });
        });
        if (utils_1.isFunction(setup)) {
            setup(template, component);
        }
        return template;
    };
    return TemplatesProvider;
}());
exports.TemplatesProvider = TemplatesProvider;
