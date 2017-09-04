"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@slicky/utils");
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var path = require("path");
var Compiler = (function () {
    function Compiler() {
    }
    Compiler.prototype.compileAndWrite = function (tsconfigPath, done) {
        if (done === void 0) { done = null; }
        this.compile(tsconfigPath, function (outDir, factory, templates) {
            fs_1.writeFileSync(path.join(outDir, 'app-templates-factory.ts'), factory, { encoding: 'utf8' });
            if (utils_1.isFunction(done)) {
                done(outDir, factory, templates);
            }
        });
    };
    Compiler.prototype.compile = function (tsconfigPath, done) {
        var _this = this;
        if (done === void 0) { done = null; }
        var worker = child_process_1.fork(path.join(__dirname, 'compilerWorker.js'), [], {
            env: {
                TSCONFIG_PATH: tsconfigPath,
            },
        });
        var compilerOptions;
        var templates = {};
        worker.on('message', function (message) {
            if (utils_1.exists(message.error)) {
                throw new Error(message.error);
            }
            if (utils_1.exists(message.slickyCompilerOptions)) {
                compilerOptions = message.slickyCompilerOptions;
            }
            if (utils_1.exists(message.template)) {
                templates[message.template.hash] = message.template.template;
            }
        });
        worker.on('exit', function (code) {
            if (code !== 0) {
                return;
            }
            var compiledTemplates = _this.processTemplates(templates);
            if (utils_1.isFunction(done)) {
                done(compilerOptions.outDir, compiledTemplates, templates);
            }
        });
    };
    Compiler.prototype.processTemplates = function (templates) {
        var templateFactories = [];
        var templateMappings = [];
        utils_1.forEach(templates, function (template, hash) {
            templateFactories.push("function _factory" + hash + "()\n" +
                "{\n" +
                (utils_1.indent(template) + "(Template);\n") +
                "}\n");
            templateMappings.push(hash + ": _factory" + hash);
        });
        return ("import {Template} from '@slicky/templates-runtime/templates';\n\n\n" +
            (templateFactories.join('\n\n') + "\n\n") +
            "const _mapping = {\n" +
            (utils_1.indent(templateMappings.join(',\n')) + "\n") +
            "};\n\n\n" +
            "export function APP_TEMPLATES_FACTORY(hash: number)\n" +
            "{\n" +
            "\tif (typeof _mapping[hash] === 'undefined') {\n" +
            "\t\tthrow new Error(\"Component template \" + hash + \" does not exists.\");\n" +
            "\t}\n\n" +
            "\treturn _mapping[hash]();\n" +
            "}\n");
    };
    return Compiler;
}());
exports.Compiler = Compiler;
