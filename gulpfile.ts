import * as gulp from 'gulp';

import './gulpfile.packages';
import './gulpfile.examples';


gulp.task('compile', gulp.series('compile:packages', 'compile:examples'));
