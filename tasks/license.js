import gulp from 'gulp';
import wrap from 'gulp-wrap';
import rename from 'gulp-rename';
import args from './lib/args';

gulp.task('license', () => {
  return gulp.src('LICENSE')
    .pipe(rename('LICENSE.txt'))
    .pipe(gulp.dest(`dist/${args.vendor}`))
});
