import path from "path";
import gulp from "gulp";
import gulpif from "gulp-if";
import livereload from "gulp-livereload";
import jsonTransform from "gulp-json-transform";
import args from "./lib/args";
import applyBrowserPrefixesFor from "./lib/applyBrowserPrefixesFor";
import expandGlobsFor from "./lib/expandGlobsFor";

gulp.task("manifest", () => {
  const cwd = path.join(process.cwd(), `dist/${args.vendor}`);

  return gulp.src("app/manifest.json")
    .pipe(
      jsonTransform(
        applyBrowserPrefixesFor(args.vendor)
      )
    )
    .pipe(
      jsonTransform(
        expandGlobsFor(["web_accessible_resources"], cwd)
      )
    )
    .pipe(gulp.dest(`dist/${args.vendor}`))
    .pipe(gulpif(args.watch, livereload()));
});
