import gulp from 'gulp';
import gulpSequence from 'gulp-sequence';

gulp.task('build', gulpSequence(
  'clean', [
    'fonts',
    'dict'
  ], [
    'manifest',
    'license',
    'scripts',
    'styles',
    'pages',
    'locales',
    'images',
    'bower',
    'livereload'
  ]
));
