"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var utils_1 = require("@slicky/utils");
var metadata_1 = require("@slicky/core/metadata");
var extensions_1 = require("@slicky/core/extensions");
var compiler_1 = require("@slicky/compiler");
var fs_1 = require("fs");
var path = require("path");
var TSCONFIG_SLICKY_COMPILER_OPTIONS = 'slickyCompilerOptions';
var APPLICATION_EXPORT = 'APPLICATION';
var tsconfigPath = process.env.TSCONFIG_PATH;
if (!utils_1.exists(tsconfigPath)) {
    process.send({ error: 'Missing TSCONFIG_PATH environment variable' });
    process.exit(1);
}
require.extensions['.html'] = function (module, filename) {
    module.exports = fs_1.readFileSync(filename, 'utf8');
};
require('ts-node').register({
    project: tsconfigPath,
    fast: true,
});
var tsconfig = JSON.parse(fs_1.readFileSync(tsconfigPath, 'utf8'));
if (!utils_1.exists(tsconfig[TSCONFIG_SLICKY_COMPILER_OPTIONS])) {
    process.send({ error: "Missing \"" + TSCONFIG_SLICKY_COMPILER_OPTIONS + "\" in " + tsconfigPath });
    process.exit(1);
}
if (!utils_1.exists(tsconfig[TSCONFIG_SLICKY_COMPILER_OPTIONS].applicationFile)) {
    process.send({ error: "Missing \"" + TSCONFIG_SLICKY_COMPILER_OPTIONS + ".applicationFile\" in " + tsconfigPath });
    process.exit(1);
}
if (!utils_1.exists(tsconfig[TSCONFIG_SLICKY_COMPILER_OPTIONS].outDir)) {
    process.send({ error: "Missing \"" + TSCONFIG_SLICKY_COMPILER_OPTIONS + ".outDir\" in " + tsconfigPath });
    process.exit(1);
}
var slickyCompilerOptions = {
    outDir: path.join(path.dirname(tsconfigPath), tsconfig[TSCONFIG_SLICKY_COMPILER_OPTIONS].outDir),
    applicationFile: path.join(path.dirname(tsconfigPath), tsconfig[TSCONFIG_SLICKY_COMPILER_OPTIONS].applicationFile),
};
process.send({ slickyCompilerOptions: slickyCompilerOptions });
var applicationFile = require(slickyCompilerOptions.applicationFile);
if (!utils_1.exists(applicationFile[APPLICATION_EXPORT])) {
    process.send({ error: "Missing " + APPLICATION_EXPORT + " export in " + applicationFile });
    process.exit(1);
}
var application = applicationFile[APPLICATION_EXPORT];
var metadataLoader = new metadata_1.DirectiveMetadataLoader(new extensions_1.ExtensionsManager);
var compiler = new compiler_1.Compiler;
utils_1.forEach(application.getDirectives(), function (directive) {
    var metadata = metadataLoader.load(directive);
    if (metadata.type !== metadata_1.DirectiveDefinitionType.Component) {
        return;
    }
    compiler.compile(metadata);
});
utils_1.forEach(compiler.getTemplates(), function (template, hash) {
    process.send({
        template: {
            hash: hash,
            template: template,
        },
    });
});
process.exit(0);
