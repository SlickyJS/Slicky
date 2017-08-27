#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require("yargs");
var path = require("path");
var colors = require("colors/safe");
var fs_1 = require("fs");
var utils_1 = require("@slicky/utils");
var compiler_1 = require("../compiler");
var args = yargs
    .usage('$0 <cmd> [args]')
    .command('compile [tsconfig]', 'Compile given app components', {
    tsconfig: {
        describe: 'Path to your project tsconfig.json file',
    },
})
    .coerce('tsconfig', function (arg) {
    if (fs_1.existsSync(arg)) {
        return arg;
    }
    return path.join(process.cwd(), arg);
})
    .strict(true)
    .help()
    .argv;
if (args._[0] !== 'compile') {
    throw new Error('Unknown command.');
}
console.log("Using typescript config file " + colors.yellow(path.relative(process.cwd(), args.tsconfig)));
(new compiler_1.Compiler).compileAndWrite(args.tsconfig, function (outDir, factory, templates) {
    console.log(colors.green("Successfully generated " + utils_1.keys(templates).length + " templates into " + path.relative(process.cwd(), outDir)));
});
