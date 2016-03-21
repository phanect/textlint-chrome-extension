import gulp from 'gulp';
import gulpif from 'gulp-if';
import livereload from 'gulp-livereload';
import args from './lib/args';
import jsonTransform from 'gulp-json-transform';
import applyBrowserPrefixesFor from './lib/applyBrowserPrefixesFor';
import expandGlobsFor from './lib/expandGlobsFor';

gulp.task('manifest', () => {
  return gulp.src('app/manifest.json')
    .pipe(
      jsonTransform(
        applyBrowserPrefixesFor(args.vendor)
        , 2
      )
    )
    .pipe(
      jsonTransform(
        expandGlobsFor(['web_accessible_resources'])
        , 2
      )
    )
    .pipe(gulp.dest(`dist/${args.vendor}`))
    .pipe(gulpif(args.watch, livereload()));
});
