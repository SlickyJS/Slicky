"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var realm_1 = require("@slicky/realm");
var utils_1 = require("@slicky/utils");
var BaseTemplate = (function () {
    function BaseTemplate(application, parent) {
        if (application === void 0) { application = null; }
        if (parent === void 0) { parent = null; }
        var _this = this;
        this.children = [];
        this.providers = {};
        this.providersFromParent = true;
        this.parameters = {};
        this.parametersFromParent = true;
        this.onDestroyed = [];
        this.application = application;
        this.parent = parent;
        this.realm = new realm_1.Realm(null, function () { return _this.refresh(); }, this.parent ? this.parent.realm : null);
        if (this.parent) {
            this.parent.children.push(this);
        }
    }
    BaseTemplate.prototype.destroy = function () {
        utils_1.forEach(this.children, function (child) {
            child.destroy();
        });
        utils_1.forEach(this.onDestroyed, function (fn) {
            fn();
        });
        if (this.parent) {
            this.parent.children.splice(this.parent.children.indexOf(this), 1);
            this.parent = null;
        }
        this.children = [];
        this.onDestroyed = [];
    };
    BaseTemplate.prototype.run = function (fn) {
        this.realm.run(fn);
    };
    BaseTemplate.prototype.onDestroy = function (fn) {
        this.onDestroyed.push(fn);
    };
    BaseTemplate.prototype.addProvider = function (name, provider) {
        this.providers[name] = provider;
    };
    BaseTemplate.prototype.disableProvidersFromParent = function () {
        this.providersFromParent = false;
    };
    BaseTemplate.prototype.getProvider = function (name) {
        if (utils_1.exists(this.providers[name])) {
            return this.providers[name];
        }
        if (this.providersFromParent && this.parent !== null) {
            return this.providers[name] = this.parent.getProvider(name);
        }
        if (this.application) {
            return this.providers[name] = this.application.getProvider(name);
        }
        return undefined;
    };
    BaseTemplate.prototype.disableParametersFromParent = function () {
        this.parametersFromParent = false;
    };
    BaseTemplate.prototype.setParameters = function (parameters) {
        this.parameters = parameters;
    };
    BaseTemplate.prototype.setParameter = function (name, value) {
        this.parameters[name] = value;
    };
    BaseTemplate.prototype.getParameter = function (name) {
        if (utils_1.exists(this.parameters[name])) {
            return this.parameters[name];
        }
        if (this.parametersFromParent && this.parent !== null) {
            return this.parent.getParameter(name);
        }
        if (this.application !== null) {
            return this.parameters[name] = this.application.getParameter(name);
        }
        return undefined;
    };
    return BaseTemplate;
}());
exports.BaseTemplate = BaseTemplate;
