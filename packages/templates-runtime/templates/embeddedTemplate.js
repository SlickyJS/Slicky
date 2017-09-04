"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var renderableTemplate_1 = require("./renderableTemplate");
var EmbeddedTemplate = (function (_super) {
    __extends(EmbeddedTemplate, _super);
    function EmbeddedTemplate(application, parent, root) {
        return _super.call(this, application, parent, root) || this;
    }
    EmbeddedTemplate.prototype.refresh = function () {
        if (!this.initialized) {
            return;
        }
        if (this.parent._refreshing > 0) {
            this.reload();
        }
        else {
            this.root.refresh();
        }
    };
    EmbeddedTemplate.prototype.reload = function () {
        _super.prototype.refresh.call(this);
    };
    return EmbeddedTemplate;
}(renderableTemplate_1.RenderableTemplate));
exports.EmbeddedTemplate = EmbeddedTemplate;
