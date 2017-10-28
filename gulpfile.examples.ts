import {exists} from '@slicky/utils';
import {Compiler} from '@slicky/compiler-cli';
import * as path from 'path';
import * as fs from 'fs';
import * as webpack from 'webpack';
import * as gulp from 'gulp';
import * as gutil from 'gulp-util';
import * as sass from 'gulp-sass';
import * as concat from 'gulp-concat';

import {getExampleWebpackConfig} from './webpack.config';


const ROOT = path.join(__dirname, 'examples', 'examples');


const tasks = [];
fs.readdirSync(ROOT)
	.map((file) => path.join(ROOT, file))
	.filter((file) => fs.statSync(file).isDirectory())
	.forEach((directory: string) => {
		const name = path.basename(directory);
		const tsconfig = JSON.parse(<string>fs.readFileSync(path.join(directory, 'tsconfig.json'), {encoding: 'utf-8'}));

		const exampleTasks = [];

		if (fs.existsSync(path.join(directory, 'styles'))) {
			exampleTasks.push(`compile:example:${name}:styles`);

			gulp.task(`compile:example:${name}:styles`, () => {
				return gulp.src(path.join(directory, 'styles', 'index.scss'))
					.pipe(sass().on('error', sass.logError))
					.pipe(concat('style.css'))
					.pipe(gulp.dest(path.join(directory, 'public')));
			});
		}

		if (exists(tsconfig.slickyCompilerOptions)) {
			exampleTasks.push(`compile:example:${name}:aot`);

			gulp.task(`compile:example:${name}:aot`, (done) => {
				(new Compiler(path.join(directory, 'tsconfig.json'))).compile(() => {
					done();
				});
			});
		}

		exampleTasks.push(`compile:example:${name}:app`);

		gulp.task(`compile:example:${name}:app`, (done) => {
			const webpackConfig = getExampleWebpackConfig(directory);

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

		tasks.push(`compile:example:${name}`);

		gulp.task(`compile:example:${name}`, gulp.series(exampleTasks));
	});


gulp.task('compile:examples', gulp.parallel(tasks));
