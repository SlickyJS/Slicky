import {forEach} from '@slicky/utils';
import {Compiler} from '@slicky/compiler-cli';
import * as path from 'path';
import * as merge from 'merge2';
import * as webpack from 'webpack';
import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as gutil from 'gulp-util';
import * as clean from 'gulp-clean';
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
		{name: 'templatesRuntime', root: path.join(__dirname, 'packages', 'templates-runtime')},
		{name: 'core', root: path.join(__dirname, 'packages', 'core')},
		{name: 'templates', root: path.join(__dirname, 'packages', 'templates')},
		{name: 'compiler', root: path.join(__dirname, 'packages', 'compiler')},
		{name: 'compilerCli', root: path.join(__dirname, 'packages', 'compiler-cli')},
		//{name: 'common', root: path.join(__dirname, 'packages', 'common')},
		{name: 'application', root: path.join(__dirname, 'packages', 'application')},
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
			extensions: ['.ts', '.js', '.json'],
		},

		module: {
			rules: [
				{test: /\.ts$/, loader: 'ts-loader'},
				{test: /\.html$/, loader: 'raw-loader'},
			],
		},
	};
}


let compileTasks = [];
let cleanTasks = [];
forEach(config.packages, (pckg: ConfigProject) => {
	compileTasks.push(`compile:${pckg.name}`);
	cleanTasks.push(`clean:${pckg.name}`);

	gulp.task(`compile:${pckg.name}`, () => {
		let project = ts.createProject(path.join(pckg.root, 'tsconfig.json'));

		let result = gulp
			.src(path.join(pckg.root, 'src', '**', '*.ts'))
			.pipe(project())
		;

		return merge([
			result.js.pipe(gulp.dest(path.join(pckg.root, 'lib'))),
			result.dts.pipe(gulp.dest(path.join(pckg.root, 'lib'))),
		]);
	});

	gulp.task(`clean:${pckg.name}`, () => {
		return gulp.src([path.join(pckg.root, 'lib'), path.join(pckg.root, 'node_modules')], {read: false})
			.pipe(clean());
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
let cleanExampleTasks = [];
forEach(config.examples, (project: ConfigProject) => {
	compileExampleTasks.push(`compile:examples:${project.name}`);
	cleanExampleTasks.push(`clean:examples:${project.name}`);

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

	gulp.task(`clean:examples:${project.name}`, () => {
		return gulp.src(path.join(project.root, 'public', 'app.js'), {read: false})
			.pipe(clean());
	});

	gulp.task(`compile:examples:${project.name}`, gulp.parallel(`compile:examples:${project.name}:app`, `compile:examples:${project.name}:styles`));
});


compileTasks.push('compile:aot');
compileTasks.push('compile:examples');

gulp.task('compile:aot', gulp.series(...compileAotTasks, (done) => done()));
gulp.task('compile:examples', gulp.series(...compileExampleTasks, (done) => done()));
gulp.task('compile', gulp.series(...compileTasks, (done) => done()));


gulp.task('clean', gulp.parallel(...cleanTasks, (done) => done()));


gulp.task('watch', gulp.series(...compileTasks, (done) => {
	forEach(config.packages, (pckg: ConfigProject) => {
		gulp.watch(path.join(pckg.root, 'src', '**', '*.ts'), <any>[`compile:${pckg.name}`, 'compile:examples']);
	});

	forEach(config.examples, (project: ConfigProject) => {
		gulp.watch(path.join(project.root, 'app', '**', '*.ts'), <any>[`compile:examples:${project.name}:app`]);
		gulp.watch(path.join(project.root, 'styles', '**', '*.scss'), <any>[`compile:examples:${project.name}:styles`]);
	});

	done();
}));
