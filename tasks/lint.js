import gulp from "gulp";
import eslint from "gulp-eslint";

export const lint = () => {
  return gulp.src(["app/scripts/**/*.js", "tests/**/*.js", "tasks/**/*.js", "*.js"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
};
