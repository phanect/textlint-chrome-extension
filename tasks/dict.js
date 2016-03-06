import gulp from 'gulp';
import gulpif from 'gulp-if';
import livereload from 'gulp-livereload';
import args from './lib/args';

gulp.task('dict', () => {
  return gulp.src('node_modules/kuromoji/dist/dict/*.dat.gz')
    .pipe(gulp.dest(`dist/${args.vendor}/dict/kuromoji`))
    .pipe(gulpif(args.watch, livereload()));
});
