"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("@slicky/reflection");
var utils_1 = require("@slicky/utils");
var event_emitter_1 = require("@slicky/event-emitter");
var input_1 = require("./input");
var output_1 = require("./output");
var hostElement_1 = require("./hostElement");
var hostEvent_1 = require("./hostEvent");
var parentComponent_1 = require("./parentComponent");
var childDirective_1 = require("./childDirective");
var childrenDirective_1 = require("./childrenDirective");
var directive_1 = require("./directive");
var component_1 = require("./component");
var filter_1 = require("./filter");
var DirectiveDefinitionType;
(function (DirectiveDefinitionType) {
    DirectiveDefinitionType[DirectiveDefinitionType["Directive"] = 0] = "Directive";
    DirectiveDefinitionType[DirectiveDefinitionType["Component"] = 1] = "Component";
})(DirectiveDefinitionType = exports.DirectiveDefinitionType || (exports.DirectiveDefinitionType = {}));
var DirectiveMetadataLoader = (function () {
    function DirectiveMetadataLoader() {
        this.loaded = new event_emitter_1.EventEmitter();
        this.definitions = {};
        this.filters = [];
    }
    DirectiveMetadataLoader.prototype.addGlobalFilters = function (filters) {
        this.filters = utils_1.merge(this.filters, filters);
    };
    DirectiveMetadataLoader.prototype.load = function (directiveType) {
        var _this = this;
        var annotation;
        if (!(annotation = reflection_1.findAnnotation(directiveType, component_1.ComponentAnnotationDefinition))) {
            if (!(annotation = reflection_1.findAnnotation(directiveType, directive_1.DirectiveAnnotationDefinition))) {
                throw new Error("Class \"" + utils_1.stringify(directiveType) + "\" is not a directive. Please add @Directive() or @Component() annotation.");
            }
        }
        var name = utils_1.stringify(directiveType);
        var directiveHash = this.getDirectiveHash(name, annotation);
        var uniqueName = name + '_' + directiveHash;
        if (utils_1.exists(this.definitions[uniqueName])) {
            return this.definitions[uniqueName];
        }
        var inputs = [];
        var outputs = [];
        var elements = [];
        var events = [];
        var parentComponents = [];
        var childDirectives = [];
        var childrenDirectives = [];
        utils_1.forEach(reflection_1.getPropertiesMetadata(directiveType), function (metadataList, property) {
            var input;
            var inputRequired = false;
            utils_1.forEach(metadataList, function (metadata) {
                if (metadata instanceof input_1.InputDefinition) {
                    input = {
                        property: property,
                        name: utils_1.exists(metadata.name) ? metadata.name : property,
                        required: false,
                    };
                }
                else if (metadata instanceof input_1.RequiredInputDefinition) {
                    inputRequired = true;
                }
                else if (metadata instanceof output_1.OutputDefinition) {
                    outputs.push({
                        property: property,
                        name: utils_1.exists(metadata.name) ? metadata.name : property,
                    });
                }
                else if (metadata instanceof hostElement_1.HostElementDefinition) {
                    var element = {
                        property: property,
                    };
                    if (metadata.selector) {
                        element.selector = metadata.selector;
                    }
                    elements.push(element);
                }
                else if (metadata instanceof hostEvent_1.HostEventDefinition) {
                    var event_1 = {
                        method: property,
                        event: metadata.event,
                    };
                    if (metadata.selector && metadata.selector.charAt(0) === '@') {
                        event_1.hostElement = metadata.selector.substring(1);
                    }
                    else if (metadata.selector) {
                        event_1.selector = metadata.selector;
                    }
                    events.push(event_1);
                }
                else if (metadata instanceof parentComponent_1.ParentComponentDefinition) {
                    parentComponents.push({
                        property: property,
                    });
                }
                else if (metadata instanceof childDirective_1.ChildDirectiveDefinition) {
                    childDirectives.push({
                        property: property,
                        directiveType: metadata.directiveType,
                    });
                }
                else if (metadata instanceof childrenDirective_1.ChildrenDirectiveDefinition) {
                    childrenDirectives.push({
                        property: property,
                        directiveType: metadata.directiveType,
                    });
                }
            });
            if (input) {
                if (inputRequired) {
                    input.required = true;
                }
                inputs.push(input);
            }
        });
        var definition = {
            type: DirectiveDefinitionType.Directive,
            name: name,
            uniqueName: uniqueName,
            hash: directiveHash,
            selector: annotation.selector,
            onInit: utils_1.isFunction(directiveType.prototype.onInit),
            onDestroy: utils_1.isFunction(directiveType.prototype.onDestroy),
            onUpdate: utils_1.isFunction(directiveType.prototype.onUpdate),
            onCheckUpdates: utils_1.isFunction(directiveType.prototype.onCheckUpdates),
            inputs: inputs,
            outputs: outputs,
            elements: elements,
            events: events,
            parentComponents: parentComponents,
        };
        if (annotation.exportAs) {
            definition.exportAs = annotation.exportAs;
        }
        if (annotation instanceof component_1.ComponentAnnotationDefinition) {
            definition.type = DirectiveDefinitionType.Component;
            definition.template = annotation.template;
            definition.changeDetection = annotation.changeDetection;
            definition.childDirectives = childDirectives;
            definition.childrenDirectives = childrenDirectives;
            if (annotation.controllerAs) {
                definition.controllerAs = annotation.controllerAs;
            }
            var filters = utils_1.unique(utils_1.merge(this.filters, annotation.filters));
            definition.filters = utils_1.map(filters, function (filterType) {
                var metadata = reflection_1.findAnnotation(filterType, filter_1.FilterDefinition);
                if (!metadata) {
                    throw new Error("Class \"" + utils_1.stringify(filterType) + "\" is not a valid filter and can not be used in \"" + definition.name + "\" directive.");
                }
                return {
                    filterType: filterType,
                    metadata: {
                        name: metadata.name,
                        hash: _this.getFilterHash(utils_1.stringify(filterType), metadata),
                    },
                };
            });
            definition.directives = utils_1.map(annotation.directives, function (directiveType) {
                return {
                    directiveType: directiveType,
                    metadata: _this.load(directiveType),
                };
            });
        }
        this.loaded.emit({
            metadata: definition,
            directiveType: directiveType,
        });
        return this.definitions[uniqueName] = definition;
    };
    DirectiveMetadataLoader.prototype.getDirectiveHash = function (name, annotation) {
        var parts = [
            name,
            annotation.selector,
        ];
        if (annotation instanceof component_1.ComponentAnnotationDefinition) {
            parts.push(annotation.template);
            parts.push(annotation.changeDetection + '');
            parts.push(utils_1.map(annotation.directives, function (directive) { return utils_1.stringify(directive); }).join(''));
            parts.push(utils_1.map(annotation.filters, function (filter) { return utils_1.stringify(filter); }).join(''));
        }
        return utils_1.hash(parts.join(''));
    };
    DirectiveMetadataLoader.prototype.getFilterHash = function (name, annotation) {
        var parts = [
            name,
            annotation.name,
        ];
        return utils_1.hash(parts.join(''));
    };
    return DirectiveMetadataLoader;
}());
exports.DirectiveMetadataLoader = DirectiveMetadataLoader;
