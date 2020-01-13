import gulp from "gulp";
import gutil from "gulp-util";
import glivereload from "gulp-livereload";
import args from "./lib/args";

export const livereload = (cb) => {
  // This task runs only if the
  // watch argument is present!
  if (!args.watch) {
    cb();
    return;
  }

  // Start livereload server
  glivereload.listen({
    reloadPage: "Extension",
    quiet: !args.verbose,
  });

  gutil.log("Starting", gutil.colors.cyan("'livereload-server'"));

  // The watching for javascript files is done by webpack
  // Check out ./tasks/scripts.js for further info.
  gulp.watch("app/manifest.json", ["manifest"]);
  gulp.watch("app/styles/**/*.css", ["styles:css"]);
  gulp.watch("app/styles/**/*.less", ["styles:less"]);
  gulp.watch("app/pages/**/*.html", ["pages"]);
  gulp.watch("app/_locales/**/*", ["locales"]);
  gulp.watch("app/images/**/*", ["images"]);
};
