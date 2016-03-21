import gulp from 'gulp';
import gulpif from 'gulp-if';
import livereload from 'gulp-livereload';
import args from './lib/args';
import glob from 'glob';
import through from 'through2';
import _ from 'lodash';
import path from 'path';

function expandWebAccessibleResources() {
  return through.obj(function (file, enc, callback) {
    if (!file.isBuffer()) {
      return callback();
    }

    const manifest = JSON.parse(file.contents.toString('utf8'));
    const cwd = path.join(process.cwd(), 'dist');
    const expanded = _
      .chain(manifest.web_accessible_resources)
      .map((pattern) => glob.sync(pattern, { cwd }))
      .flatten()
      .value();

    manifest.web_accessible_resources = expanded;
    file.contents = new Buffer(JSON.stringify(manifest));
    this.push(file);

    return callback();
  });
}

gulp.task('manifest', () => {
  return gulp.src('app/manifest.json')
    .pipe(expandWebAccessibleResources())
    .pipe(gulp.dest('dist'))
    .pipe(gulpif(args.watch, livereload()));
});
