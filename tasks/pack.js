import gulp from 'gulp';
import { colors, log } from 'gulp-util';
import zip from 'gulp-zip';
import packageDetails from '../package.json';
import args from './lib/args';

gulp.task('pack', ['build'], () => {
  let name = packageDetails.name;
  let version = packageDetails.version;
  let filename = `${name}-${version}.zip`;
  return gulp.src('dist/**/*')
    .pipe(zip(filename))
    .pipe(gulp.dest('./packages'))
    .on('end', () => {
      let distStyled = colors.magenta('dist');
      let filenameStyled = colors.magenta(`./packages/${filename}`);
      log(`Packed ${distStyled} to ${filenameStyled}`);
    });
});
