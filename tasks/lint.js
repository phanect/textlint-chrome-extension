import gulp from "gulp";
import eslint from "gulp-eslint";

gulp.task("lint", () => {
  return gulp.src(["**/*.js", "!node_modules/**", "!bower_components/**", "!dist/**"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
