import gulp, { series } from "gulp";
import gulpif from "gulp-if";
import livereload from "gulp-livereload";
import args from "./lib/args";

const fontsApp = () => {
  return gulp.src("app/fonts/**/*.{woff,ttf,eot,svg}")
    .pipe(gulp.dest(`dist/${args.vendor}/fonts`))
    .pipe(gulpif(args.watch, livereload()));
};

const fontsFontAwesome = () => {
  return gulp.src("bower_components/font-awesome/fonts/*.{woff,woff2,eot,svg,ttf}")
    .pipe(gulp.dest(`dist/${args.vendor}/fonts/font-awesome`));
};

export const fonts = series(
  fontsApp,
  fontsFontAwesome,
);
