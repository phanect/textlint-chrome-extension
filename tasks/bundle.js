import path from "path";
import gulp from "gulp";
import bundlejs from "./lib/bundlejs";

gulp.task("bundle", () => {
  const outPath = path.join(__dirname, "../app/scripts/lib/app");
  return bundlejs("bundles.js").pipe(gulp.dest(outPath));
});

gulp.task("bundle:test", () => {
  const outPath = path.join(__dirname, "../tmp/bundle");
  return bundlejs("bundles.js", { empty: true }).pipe(gulp.dest(outPath));
});
