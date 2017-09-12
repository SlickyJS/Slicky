import {forEach} from '@slicky/utils';
import {Compiler} from '@slicky/compiler-cli';
import * as path from 'path';
import * as merge from 'merge2';
import * as webpack from 'webpack';
import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as gutil from 'gulp-util';
import * as sass from 'gulp-sass';
import * as concat from 'gulp-concat';


declare interface ConfigProject
{
	name: string;
	root: string;
}

declare interface Config
{
	[type: string]: Array<ConfigProject>;
}


const config: Config = {
	packages: [
		{name: 'changeDetection', root: path.join(__dirname, 'packages', 'change-detection')},
		{name: 'tinyJS', root: path.join(__dirname, 'packages', 'tiny-js')},
		{name: 'htmlParser', root: path.join(__dirname, 'packages', 'html-parser')},
		{name: 'cssParser', root: path.join(__dirname, 'packages', 'css-parser')},
		{name: 'templatesRuntime', root: path.join(__dirname, 'packages', 'templates-runtime')},
		{name: 'core', root: path.join(__dirname, 'packages', 'core')},
		{name: 'extensionTranslator', root: path.join(__dirname, 'packages', 'extension-translator')},
		{name: 'templates', root: path.join(__dirname, 'packages', 'templates')},
		{name: 'application', root: path.join(__dirname, 'packages', 'application')},
		{name: 'compiler', root: path.join(__dirname, 'packages', 'compiler')},
		{name: 'compilerCli', root: path.join(__dirname, 'packages', 'compiler-cli')},
		{name: 'platformBrowser', root: path.join(__dirname, 'packages', 'platform-browser')},
		{name: 'platformServer', root: path.join(__dirname, 'packages', 'platform-server')},
	],
	aot: [
		{name: 'templates', root: path.join(__dirname, 'packages', 'examples', 'examples', 'templates')},
		{name: 'todo', root: path.join(__dirname, 'packages', 'examples', 'examples', 'todo')},
	],
	examples: [
		{name: 'directive', root: path.join(__dirname, 'packages', 'examples', 'examples', 'directive')},
		{name: 'templates', root: path.join(__dirname, 'packages', 'examples', 'examples', 'templates')},
		{name: 'todo', root: path.join(__dirname, 'packages', 'examples', 'examples', 'todo')},
	],
};


function getExampleWebpackConfig(project: ConfigProject): any
{
	return {
		devtool: 'source-map',

		entry: {
			app: path.join(project.root, 'app', 'bootstrap.ts'),
		},

		output: {
			path: path.join(project.root, 'public'),
			filename: 'app.js',
		},

		resolve: {
			extensions: ['.js', '.json', '.ts'],
		},

		module: {
			rules: [
				{test: /\.ts$/, use: 'ts-loader'},
				{test: /\.html$/, use: 'raw-loader'},
				{test: /\.css$/, use: 'raw-loader'},
			],
		},
	};
}


let compileTasks = [];
forEach(config.packages, (pckg: ConfigProject) => {
	compileTasks.push(`compile:${pckg.name}`);

	gulp.task(`compile:${pckg.name}`, () => {
		let project = ts.createProject(path.join(pckg.root, 'tsconfig.json'));

		let result = project.src()
			.pipe(project());

		return merge([
			result.js.pipe(gulp.dest(pckg.root)),
			result.dts.pipe(gulp.dest(pckg.root)),
		]);
	});
});


let compileAotTasks = [];
forEach(config.aot, (project: ConfigProject) => {
	compileAotTasks.push(`compile:aot:${project.name}`);

	gulp.task(`compile:aot:${project.name}`, (done) => {
		(new Compiler).compileAndWrite(path.join(project.root, 'tsconfig.json'), () => {
			done();
		});
	});
});


let compileExampleTasks = [];
forEach(config.examples, (project: ConfigProject) => {
	compileExampleTasks.push(`compile:examples:${project.name}`);

	gulp.task(`compile:examples:${project.name}:app`, (done) => {
		const webpackConfig = getExampleWebpackConfig(project);

		webpack(webpackConfig, (err, stats) => {
			if(err) {
				throw new gutil.PluginError('webpack', err);
			}

			gutil.log('[webpack]', stats.toString({
				colors: true,
			}));

			done();
		});
	});

	gulp.task(`compile:examples:${project.name}:styles`, () => {
		return gulp.src(path.join(project.root, 'styles', 'index.scss'))
			.pipe(sass().on('error', sass.logError))
			.pipe(concat('style.css'))
			.pipe(gulp.dest(path.join(project.root, 'public')));
	});

	gulp.task(`compile:examples:${project.name}`, gulp.parallel(`compile:examples:${project.name}:app`, `compile:examples:${project.name}:styles`));
});


compileTasks.push('compile:aot');
compileTasks.push('compile:examples');

gulp.task('compile:aot', gulp.series(...compileAotTasks, (done) => done()));
gulp.task('compile:examples', gulp.series(...compileExampleTasks, (done) => done()));
gulp.task('compile', gulp.series(...compileTasks, (done) => done()));
