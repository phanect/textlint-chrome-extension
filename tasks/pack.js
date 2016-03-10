import gulp from 'gulp';
import { colors, log } from 'gulp-util';
import crx from 'gulp-crx-pack';
import packageDetails from '../package.json';
import args from './lib/args';
import path from 'path';
import fs from 'fs';

gulp.task('pack', ['build'], () => {
  let name = packageDetails.name;
  let version = packageDetails.version;
  let filename = `${name}-${version}.crx`;
  return gulp.src(`dist/${args.vendor}`)
    .pipe(crx({
      privateKey: fs.readFileSync('certs/key.pem', 'utf-8'),
      filename: filename,
    }))
    .pipe(gulp.dest('./packages'))
    .on('end', () => {
      let distStyled = colors.magenta(`dist/${args.vendor}`);
      let filenameStyled = colors.magenta(`./packages/${filename}`);
      log(`Packed ${distStyled} to ${filenameStyled}`);
    });
});
