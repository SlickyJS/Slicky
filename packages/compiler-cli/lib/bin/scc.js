#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var yargs = require("yargs");
var path = require("path");
var colors = require("colors/safe");
var fs_1 = require("fs");
var utils_1 = require("@slicky/utils");
var core_1 = require("@slicky/core");
var compiler_1 = require("@slicky/compiler");
var args = yargs
    .usage('$0 <cmd> [args]')
    .command('compile [tsconfig]', 'Compile given app components', {
    tsconfig: {
        describe: 'Path to your project tsconfig.json file',
    },
})
    .coerce('tsconfig', function (arg) {
    return path.join(process.cwd(), arg);
})
    .strict(true)
    .help()
    .argv;
require.extensions['.html'] = function (module, filename) {
    module.exports = fs_1.readFileSync(filename, 'utf8');
};
require('ts-node').register({
    project: args.tsconfig,
    fast: true,
});
if (args._[0] !== 'compile') {
    throw new Error('Unknown command.');
}
console.log("Using typescript config file " + colors.yellow(path.relative(process.cwd(), args.tsconfig)));
var tsconfig = JSON.parse(fs_1.readFileSync(args.tsconfig, 'utf8'));
if (!utils_1.exists(tsconfig.slickyCompilerOptions.directives)) {
}
if (!utils_1.exists(tsconfig.slickyCompilerOptions.outDir)) {
}
var directivesFile = require(path.join(path.dirname(args.tsconfig), tsconfig.slickyCompilerOptions.directives));
var outDir = path.join(path.dirname(args.tsconfig), tsconfig.slickyCompilerOptions.outDir);
if (!utils_1.exists(directivesFile.APP_DIRECTIVES)) {
}
var directives = directivesFile.APP_DIRECTIVES;
var metadataLoader = new core_1.DirectiveMetadataLoader;
var compiler = new compiler_1.Compiler;
utils_1.forEach(directives, function (directive) {
    var metadata = metadataLoader.load(directive);
    if (metadata.type !== core_1.DirectiveDefinitionType.Component) {
        return;
    }
    compiler.compile(metadata);
});
var templateFactories = [];
var templateMappings = [];
utils_1.forEach(compiler.getTemplates(), function (template, hash) {
    templateFactories.push("function _factory" + hash + "()\n" +
        "{\n" +
        (utils_1.indent(template) + "(Template);\n") +
        "}\n");
    templateMappings.push(hash + ": _factory" + hash);
});
var factory = ("import {Template} from '@slicky/templates-runtime';\n\n\n" +
    (templateFactories.join('\n\n') + "\n\n") +
    "const _mapping = {\n" +
    (utils_1.indent(templateMappings.join(',\n')) + "\n") +
    "};\n\n\n" +
    "function _factory(hash: number)\n" +
    "{\n" +
    "\tif (typeof _mapping[hash] === 'undefined') {\n" +
    "\t\tthrow new Error(\"Component template \" + hash + \" does not exists.\");\n" +
    "\t}\n\n" +
    "\treturn _mapping[hash]();\n" +
    "}\n\n\n" +
    "export const APP_TEMPLATES_FACTORY = _factory;\n");
fs_1.writeFileSync(path.join(outDir, 'app-templates-factory.ts'), factory, { encoding: 'utf8' });
console.log(colors.green("Successfully generated " + templateFactories.length + " templates into " + path.relative(process.cwd(), outDir)));
